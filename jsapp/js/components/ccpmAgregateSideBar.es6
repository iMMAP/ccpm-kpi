import React from 'react';
import PropTypes from 'prop-types';
import reactMixin from 'react-mixin';
import autoBind from 'react-autobind';
import Reflux from 'reflux';
import { Link } from 'react-router';
import mixins from '../mixins';
import {bem} from '../bem';
import ui from '../ui';
import {searches} from '../searches';
import {stores} from '../stores';
import {CATEGORY_LABELS} from 'js/constants';
import Select from 'react-select'

class SidebarAgregatedCCPM extends Reflux.Component {
  constructor(props) {
    super(props);
    var selectedCategories = {
      'Draft': false,
      'Deployed': false,
      'Archived': false
    };
    this.state = {
      selectedCategories: selectedCategories,
      searchContext: searches.getSearchContext('forms', {
        filterParams: {
          assetType: 'asset_type:survey',
        },
        filterTags: 'asset_type:survey',
      }),
      selectedYear : null,
      selectedCluster: null
    };
    this.store = stores.aggregatedReport;
    autoBind(this);
  }
  componentDidMount () {
    this.listenTo(this.searchStore, this.searchChanged);
    if (!this.isFormList())
      this.searchSemaphore();
  }
  componentWillReceiveProps () {
    this.listenTo(this.searchStore, this.searchChanged);
  }
  searchChanged (searchStoreState) {
    this.setState(searchStoreState);
  }
  renderMiniAssetRow (asset) {
    var href = `/forms/${asset.uid}`;

    if (this.userCan('view_submissions', asset) && asset.has_deployment && asset.deployment__submission_count)
      href = href + '/summary';

    return (
      <bem.FormSidebar__item key={asset.uid} className={asset.uid == this.currentAssetID() ? 'active' : ''}>
        <Link to={href} className={'form-sidebar__itemlink'}>
          <ui.SidebarAssetName {...asset} />
        </Link>
      </bem.FormSidebar__item>
    );
  }
  toggleCategory(c) {
    return function (e) {
    var selectedCategories = this.state.selectedCategories;
    selectedCategories[c] = !selectedCategories[c];
      this.setState({
        selectedCategories: selectedCategories,
      });
    }.bind(this);
  }

  getYears(deployedReports, year) {
    const reportByYear = [];
    const years = [];
    const clusters = [];
    deployedReports.filter(report => report.settings && report.settings.ccpmData).forEach(report => {
      const ccpmData = JSON.parse(report.settings.ccpmData);
      if(ccpmData && ccpmData.year && !years.includes(ccpmData.year)) years.push(ccpmData.year); 
      if(ccpmData && ccpmData.year ) reportByYear.push({year: ccpmData.year, cluster: ccpmData.cluster,report }); 
      if(ccpmData.year === year){
        if(ccpmData && ccpmData.cluster && !clusters.includes(ccpmData.cluster)) clusters.push(ccpmData.cluster);
      } 
    })

    return {reportByYear, years, clusters};
  }

  generateReport(items){
    const reports = items.filter(e => this.state.selectedYear.toString() === e.year && this.state.selectedCluster.map(v=>v.value).includes(e.cluster));
    this.store.setState({selectedAssetUids: reports.map(v =>v.report.uid)})
  }

  render () {
    var s = this.state;

    var activeItems = 'defaultQueryCategorizedResultsLists';

    // sync sidebar with main list when it is not a search query, allows for deletes to update the sidebar as well
    // this is a temporary fix, a proper fix needs to update defaultQueryCategorizedResultsLists when deleting/archiving/cloning
    if (
      s.searchState === 'done' &&
      (s.searchString === false || s.searchString === '') &&
      s.searchResultsFor &&
      s.searchResultsFor.assetType === 'asset_type:survey'
    ) {
      activeItems = 'searchResultsCategorizedResultsLists';
    }

    const ccpmData = s[activeItems] ? this.getYears(s[activeItems]['Deployed'], this.state.selectedYear):  {reportByYear: [], years: [], clusters: []}

    if (s.searchState === 'loading' && s.searchString === false) {
      return (
        <bem.Loading>
          <bem.Loading__inner>
            <i />
            {t('loading...')}
          </bem.Loading__inner>
        </bem.Loading>
      );
    }

    return (
      <bem.FormSidebar>
        {
          (() => {
            if (s.defaultQueryState === 'loading') {
              return (
                <bem.Loading>
                  <bem.Loading__inner>
                    <i />
                    {t('loading...')}
                  </bem.Loading__inner>
                </bem.Loading>
              );
            } else if (s.defaultQueryState === 'done') {
              return <>
                <p>Select a Year</p>
                <select onChange={(e)=>{
                  this.setState({selectedYear: e.target.value})
                }} style={{width: '100%', height: '50px'}}>
                  <option>Select</option>
                  {ccpmData.years.map(y => <option key={y} value={y}>{y.toString()}</option>)}
                </select>
                {this.state.selectedYear && <> <p>Select a Cluster </p>
                  <Select onChange={(e)=>{
                    if(e.find(v => v.value === 'all')) this.setState({selectedCluster: ccpmData.clusters.map(y => ({value: y, label: y}))});
                    else this.setState({selectedCluster:e});
                  }} value={this.state.selectedCluster} options={[{value: 'all', label: 'Select All'},...ccpmData.clusters.map(y => ({value: y, label: y}))]} isMulti/>
                  </>}
                {(this.state.selectedCluster && this.state.selectedCluster.length > 1) && 
                <div style={{marginTop: '30px'}}>
                  <bem.KoboButton onClick={()=>{this.generateReport(ccpmData.reportByYear)}}  m={['blue', 'fullwidth']}>
                    Generate Report
                  </bem.KoboButton>
                </div>
                }
              </>
            }
          })()
        }
      </bem.FormSidebar>
    );
  }
}

SidebarAgregatedCCPM.contextTypes = {
  router: PropTypes.object
};

reactMixin(SidebarAgregatedCCPM.prototype, searches.common);
reactMixin(SidebarAgregatedCCPM.prototype, Reflux.ListenerMixin);
reactMixin(SidebarAgregatedCCPM.prototype, mixins.contextRouter);
reactMixin(SidebarAgregatedCCPM.prototype, mixins.permissions);

export default SidebarAgregatedCCPM;
