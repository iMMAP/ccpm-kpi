import React from 'react';
import ReactDOM from 'react-dom';
import reactMixin from 'react-mixin';
import autoBind from 'react-autobind';
import Reflux from 'reflux';
import _ from 'underscore';
import {dataInterface} from '../dataInterface';
import {bem} from '../bem';
import {stores} from '../stores';
import mixins from '../mixins';
import DocumentTitle from 'react-document-title';
import alertify from 'alertifyjs';
import ccpmReport from '../ccpmReport';
import {ccpm_getQuestionInRange} from '../ccpmDataset';
import {titleConstants } from '../ccpmDataset';
import ui from '../ui';
import Radio from './radio';


import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.plugins.register(ChartDataLabels);


class AgregatedReportContents extends React.Component {
  constructor(props) {
    super(props);
    this.state= {
      reportData: [], 
      tnslIndex:0,
      isLoading: false
    }
  }

  componentDidMount(){
    this.loadChart();
  }
  componentWillReceiveProps(props, b){
    this.loadChart(props.parentState.languageIndex);
  }

  compareString(a, b, property){
      var propertyA = property ?  a[property].toUpperCase() : a.toUpperCase();
      var propertyB = property ?  b[property].toUpperCase() : b.toUpperCase();
      if (propertyA < propertyB) {
        return -1;
      }
      if (propertyA > propertyB) {
        return 1;
      }
      return 0;
  }

  compareNumbers(a, b) {
    return a - b;
  }

  getOverallCompletionRateRegion(){
    const regions  = [];
    this.props.parentState.reports.forEach(rep => {
      const ccpmData = JSON.parse(rep.asset.settings.ccpmData);
      const regionIndex = regions.findIndex(r => ccpmData.region && r.name === ccpmData.region.label);
      if(regionIndex > -1 && ccpmData.region){
        regions[regionIndex].reports.push({...rep, ccpmData});
      } else if(ccpmData.region) regions.push({name: ccpmData.region.label, reports: [{...rep, ccpmData}]});
    })
    return regions.sort((a,b) => this.compareString(a, b, 'name'));
  }

  getNationalLevel(reports){
    return reports.filter(rep => !rep.ccpmData.addSubCluster).length;
  }

  getSubNationalLevel(reports) {
    return reports.filter(rep => rep.ccpmData.addSubCluster).length;
  }

  getCoordinatorOrPartnerResponses(reports, type) {
    let coordinators = 0;
    reports.forEach(rep => {
      const typeOfSurvey = rep.reportData.find(v => v.name ==='type_of_survey');
      if(typeOfSurvey){
        const coordinatorIndex = typeOfSurvey.data.responses.findIndex(v => v.toLowerCase().includes(type));
        if(coordinatorIndex > -1){
          coordinators+= typeOfSurvey.data.frequencies[coordinatorIndex];
        }
      }
    })
    return coordinators;
  }

  getLanguageIndex(report){
    const { asset: { content: { translations } }} = report;
    let currentLanguageIndex = currentLanguageIndex = translations.findIndex(lan => lan && lan.includes('en'));
    return currentLanguageIndex;
  }

  calculatePercentage(total, sum) {
    if (isNaN(total)) total = 0;
    if (isNaN(sum) || sum === 0) return 0;
    return (total / sum) * 100;
  }

  getTranslation(labels, code, languageIndex){
    const language = labels.find(l => l.code === code);
    if(language) return language.translations[languageIndex];
    return '';
  }

  buildPartnerByTypeOptions(language) {

    const data = {};
    const labelData = [];

    this.props.parentState.reports.forEach(rep => {
      const languageIndex = this.getLanguageIndex(rep);
      rep.totalResponseDisagregatedByPartner.forEach(element=>{
        const label = element.row.label[languageIndex] || element.row.label[1];

        if(element.data.provided > 0){
        labelData.push({code: label, translations: element.row.label});
        if(data[label])data[label]+=element.questionsDisagregatedByPartner;
        else data[label] = element.questionsDisagregatedByPartner;
        }
      })
    })
    
    var chartType = 'horizontalBar';

    // TODO: set as default globally in a higher level (PM)

    var baseColor = '#1f5782';
    Chart.defaults.global.elements.rectangle.backgroundColor = baseColor;

    const d = Object.keys(data).map(e => ({label: this.getTranslation(labelData, e, language) || e, value: data[e]}));
    const sorted = d.sort((a,b) => b.value - a.value);

    var datasets = [{
      label: '%',
      axis: 'y',
      data: sorted.map(e=>{
        return (e.value / (Object.values(data).reduce((a,b)=>a+b) || 1)) * 100;
      }),
      backgroundColor: [
        'rgb(31,87,130)',
      ],
      borderColor: [
        'rgba(29, 110, 156, 0.8)',
      ],
      borderWidth: 0
    }];

    const labels = sorted.map(l => l.label);

    var opts = {
      type: chartType,
      responsive: true,
      plugins: [ChartDataLabels],
      data: {
        labels: labels,
        datasets
      },
      options: {
        legend: {
          display: false
        },
        animation: {
          duration: 500
        },
        scales: {
          xAxes: [{
              gridLines: {
                  display:false
              },
              ticks: {
                display: false
              }
          }],
          yAxes: [{
              gridLines: {
                  display:false
              },
          }]
      },
        plugins: {
          datalabels: {
            color: '#fff',
            formatter: function (value, context) {
              const percent = Number.parseFloat(value);
              return percent > 0 ? `${Math.round(percent)}%` : '';
            },
            clamp: true,
            align: 'center'
          }
        },
        tooltips: {
          callbacks: {
            label: function (a, b) {
              return `${a.yLabel} (%): ${Math.round(a.xLabel)}`;
            },
            title: function(){
              return ''
            },
            caretSize: 0
          },
          displayColors: false
        }
        }
    };

    return opts;
  }

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  buildPartnerByTypeAndRegionOptions(language) {

    const data = {};
    const totalRegion = {};
    const labelData = [];

    this.props.parentState.reports.forEach(rep => {
      const languageIndex = this.getLanguageIndex(rep);
      const ccpmData = JSON.parse(rep.asset.settings.ccpmData);
      if(ccpmData.region){
      rep.totalResponseDisagregatedByPartner.forEach((element, index)=>{
        const elementEffective = rep.totalEffectiveResponseDisagregatedByPartner[index];
        const label = element.row.label[languageIndex] || element.row.label[1];
        if(!data[label]) data[label] = {};
        if(element.data.provided > 0){
          labelData.push({code: label, translations: element.row.label});
          if(!data[label][ccpmData.region.label]) data[label][ccpmData.region.label] = {total: 0, effective:0};
          data[label][ccpmData.region.label].total+=element.questionsDisagregatedByPartner;
          data[label][ccpmData.region.label].effective+=element.data.mean;

        if(totalRegion[ccpmData.region.label]) totalRegion[ccpmData.region.label] += element.questionsDisagregatedByPartner;
        else totalRegion[ccpmData.region.label] = element.questionsDisagregatedByPartner;
        }
      })}
    });
    
    var chartType = 'bar';

    // TODO: set as default globally in a higher level (PM)

    var baseColor = '#1D6F9C';
    Chart.defaults.global.elements.rectangle.backgroundColor = baseColor;
    const colors  = ['#1f5782', '#007899', '#009898', '#48b484', '#9fc96f', '#f8d871', '#f87571', '#95069c', '#073691']

    const set = [];

    Object.keys(data).forEach((key, index) => {
      set.push({
      label: this.getTranslation(labelData, key, language) || key,
      data: Object.keys(data[key]).sort((a,b) => this.compareString(a, b)).map(e=>{
        return this.calculatePercentage(data[key][e].total,data[key][e].effective)
      }),
      borderWidth: 1,
      backgroundColor: colors[index]
    })});

    let labels = [];
    labels = Object.keys(totalRegion).sort((a,b) => this.compareString(a, b))

    var opts = {
      type: chartType,
      responsive: true,
      plugins: [ChartDataLabels],
      data: {
        labels: labels,
        datasets: set
      },
      options: {
        scales: {
          yAxes: [{
              ticks: {
                display: false
              },
              gridLines: {
                display:false
            }  
          }],
          xAxes: [{
            gridLines: {
                display:false
            }
        }],
        },
        legend: {
          display: true,
          labels: {
              color: 'rgb(255, 99, 132)'
          }
        },
        animation: {
          duration: 500
        },
        tooltips: {
          callbacks: {
            label: function () {
              return null;
            },
            caretSize: 0
          },
          displayColors: false
        },
        plugins: {
          datalabels: {
            color: '#fff',
            formatter: function (value, context) {
              
              const percent = Number.parseInt(value);
              return percent > 0 ? `${percent}%` : '';
            },
            clamp: true,
            align: 'center'
          }
        },
        }
    };

    return opts;
  }

  buildPartnerByClusterOptions() {
    const data = {};
    const colors = {};
    const regions  = []

    this.props.parentState.reports.forEach(rep => {
      const { totalReponses: { numberOfPartner, sum } } = rep;
      const ccpmData = JSON.parse(rep.asset.settings.ccpmData);
      if(ccpmData.region){
        if(!colors[ccpmData.region.label]) colors[ccpmData.region.label] = this.getRandomColor();
        if(ccpmData.cluster){
         regions.push({cluster: ccpmData.cluster, region: ccpmData.region});
         if(!data[ccpmData.cluster])data[ccpmData.cluster] = {total: 0, expected: 0};
         data[ccpmData.cluster].total += sum;
         data[ccpmData.cluster].expected += numberOfPartner;
         data[ccpmData.cluster].color = colors[ccpmData.region.label];
      }}
    });

    
    var chartType = 'horizontalBar';

    // TODO: set as default globally in a higher level (PM)

    var baseColor = '#1f5782';
    Chart.defaults.global.elements.rectangle.backgroundColor = baseColor;

    const set = [];

    set.push({
      label: 'By country',
      data: Object.keys(data).map(key=>{
        return this.calculatePercentage(data[key].expected, data[key].total );
      }),
      borderWidth: 1,
      backgroundColor: Object.keys(data).map(e => data[e].color)
    });

    let labels = Object.keys(data);

    const colorArray = Object.keys(colors).map(c => ({color: colors[c], region: c})).sort((a,b) => this.compareString(a,b,'region'));

    var opts = {
      type: chartType,
      responsive: true,
      plugins: [ChartDataLabels],
      data: {
        labels: labels,
        datasets: set
      },
      options: {
        scales: {
          xAxes: [{
              ticks: {
                  min: 0,
              }
          }]
        },
        
        legend: {
          display: false,
          position: 'bottom'
        },
        legendCallback: function(chart) { 
          var text = []; 
          text.push('<class="' + chart.id + '-legend">'); 
          for (var i = 0; i < colorArray.length; i++) { 
              text.push('<li style="display:inline-block; margin-left: 10px"><span style="height:10px;width:10px;margin-right:8px;display:inline-block;background-color:' + 
                         colorArray[i].color + 
                         '"></span>'); 
              if (Object.keys(colors)[i]) { 
                  text.push(colorArray[i].region); 
              } 
              text.push('</li>'); 
          } 
          text.push('</ul>'); 
          return text.join(''); 
      },
        animation: {
          duration: 500
        },
        plugins: {
          datalabels: {
            color: '#fff',
            formatter: function (value, context) {
              const percent = Number.parseInt(value);
              return percent > 0 ? `${percent}%` : '';
            },
            clamp: true,
            align: 'center'
          }
        },
        tooltips: {
          callbacks: {
            label: function (a, b) {
              return `${a.yLabel} (%): ${Math.round(a.xLabel)}`;
            },
            title: function (a,b){
              const regionEntry = regions.find(v => v.cluster === a[0].yLabel);
              return regionEntry ? regionEntry.region.label : ''
            },
            caretSize: 0
          },
          displayColors: false
        }
        }
    };

    return opts;
  }

  loadChart(languageIndex = 0) {

    var canvas = ReactDOM.findDOMNode(this.refs[`chartbyType`]);
    var opts = this.buildPartnerByTypeOptions(languageIndex);

    if (this[`itemChart-chartByType`]) {
      this[`itemChart-chartByType`].destroy();
      this[`itemChart-chartByType`] = new Chart(canvas, opts);
    } else {
      this[`itemChart-chartByType`] = new Chart(canvas, opts);
    }

     canvas = ReactDOM.findDOMNode(this.refs[`chartbyTypeAndRegion`]);
     opts = this.buildPartnerByTypeAndRegionOptions(languageIndex);

    if (this[`itemChart-chartbyTypeAndRegion`]) {
      this[`itemChart-chartbyTypeAndRegion`].destroy();
      this[`itemChart-chartbyTypeAndRegion`] = new Chart(canvas, opts);
    } else {
      this[`itemChart-chartbyTypeAndRegion`] = new Chart(canvas, opts);
    }

    canvas = ReactDOM.findDOMNode(this.refs[`chartbyCluster`]);
    opts = this.buildPartnerByClusterOptions([], 'en');

   if (this[`itemChart-chartbyCluster`]) {
     this[`itemChart-chartbyCluster`].destroy();
     this[`itemChart-chartbyCluster`] = new Chart(canvas, opts);
     document.getElementById('custom-legend').innerHTML = this[`itemChart-chartbyCluster`].generateLegend();
   } else {
     this[`itemChart-chartbyCluster`] = new Chart(canvas, opts);
     document.getElementById('custom-legend').innerHTML = this[`itemChart-chartbyCluster`].generateLegend();
   }

  }


  render () {
    const {tnslIndex, reportData} = this.state;
    const completionRateRegions = this.getOverallCompletionRateRegion();
    const {languageIndex, languages} = this.props.parentState;
    const lcode = languages[languageIndex].code;
    return (
      <div id='document-report'>
        <h1 className="bigTitle">{titleConstants.completionAndResponseRate[lcode]}</h1>
        <h1 className="title" style={{marginTop: '22px' }}>{titleConstants.overallCompletionRate[lcode]}</h1>
        <table style={{ borderCollapse: 'collapse', width: '75%', margin: '30px auto' }}>
          <thead>
            <th style={{color: '#ffffff', minWidth: '100px'}}>{titleConstants.region[lcode]}</th>
            <th className="agregatedTableTitle">{titleConstants.nationalLevel[lcode]}</th>
            <th className="agregatedTableTitle">{titleConstants.subNational[lcode]}</th>
            <th className="agregatedTableTitle">{titleConstants.coortinatorResponse[lcode]}</th>
            <th className="agregatedTableTitle">{titleConstants.partnerResponse[lcode]}</th>
          </thead>
              <tbody>
              {completionRateRegions.map(rg => <tr>
                  <td className="agregatedTableTitle" style={{textAlign: 'center'}}>{rg.name}</td>
                  <td className="agregatedTableContent">{this.getNationalLevel(rg.reports)}</td>
                  <td className="agregatedTableContent">{this.getSubNationalLevel(rg.reports)}</td>
                  <td className="agregatedTableContent">{this.getCoordinatorOrPartnerResponses(rg.reports, 'coordinator')}</td>
                  <td className="agregatedTableContent">{this.getCoordinatorOrPartnerResponses(rg.reports, 'partner')}</td>
                </tr>
              )}
              </tbody>
            </table>
            <h1 className="title" style={{paddingTop: '20px', paddingBottom: '10px' }}>{titleConstants.responseRateByRegionAndType[lcode]}</h1>
            <div style={{ width: '75%', margin: '20px auto', border: "1px #000 solid", padding: '20px'}}>
              <canvas ref={`chartbyType`} id={`chartbyType`} />
            </div>
            <h1 className="title" style={{paddingTop: '22px', paddingBottom: '10px' }}>{titleConstants.partnerByRegion[lcode]}</h1>
            <div style={{ width: '75%', margin: '20px auto', border: "1px #000 solid", padding: '20px'}}>
              <canvas ref={`chartbyTypeAndRegion`} id={`chartbyTypeAndRegion`} />
            </div>
            <h1 className="title" style={{paddingTop: '22px', paddingBottom: '10px' }}>{titleConstants.reponseRateByCOuntry[lcode]}</h1>
            <div style={{ width: '75%', margin: '20px auto', border: "1px #000 solid", padding: '20px'}}>
              <canvas ref={`chartbyCluster`} id={`chartbyCluster`} />
              <div style={{margin: '0px auto', textAlign:'center', alignContent: 'center'}} id="custom-legend"/>
            </div>
         
      </div>
    );
  }
};

class ReportLanguageSettings extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      activeModalTab: 0,
      languageIndex: this.props.parentState.languageIndex || 0
    };
  }
  toggleTab(evt) {
    var i = evt.target.getAttribute('data-index');
    this.setState({
      activeModalTab: parseInt(i),
    });
  }
  translationIndexChange (name, value) {
    this.setState({languageIndex: parseInt(value)});
  }

  saveReportStyles() {
     this.props.changeLanguage(this.state.languageIndex);
     this.props.toggleReportGraphSettings()
  }
  render () {
    var tabs = [];
      const selectedTranslationOptions = [];
      tabs.push(t('Language'));
      ['English','French'].map((row, i) => {
        selectedTranslationOptions.push({
          value: i,
          label: row || t('Unnamed language')
        });
      })

    var modalTabs = tabs.map(function(tab, i){
      return (
        <button className={`mdl-button mdl-button--tab ${this.state.activeModalTab === i ? 'active' : ''}`}
                onClick={this.toggleTab}
                data-index={i}
                key={i}>
          {tab}
        </button>
      );
    }, this);

    return (
      <bem.GraphSettings>
        <ui.Modal.Tabs>
          {modalTabs}
        </ui.Modal.Tabs>
        <ui.Modal.Body>
          <div className='tabs-content'>
            {selectedTranslationOptions.length > 1 &&
              <div className='graph-tab__translation' id='graph-labels'>
                <Radio
                  name='reports-selected-translation'
                  options={selectedTranslationOptions}
                  onChange={this.translationIndexChange}
                  selected={this.state.languageIndex}
                />
              </div>
            }
          </div>
          <ui.Modal.Footer>
            <bem.KoboButton m='blue' onClick={this.saveReportStyles}>
              {t('Save')}
            </bem.KoboButton>
          </ui.Modal.Footer>
        </ui.Modal.Body>
      </bem.GraphSettings>
    );

  }
};

class Reports extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      graphWidth: '700',
      graphHeight: '250',
      translations: false,
      activeModalTab: 0,
      error: false,
      isFullscreen: false,
      reportLimit: 200,
      customReports: false,
      showReportGraphSettings: false,
      showCustomReportModal: false,
      currentCustomReport: false,
      currentQuestionGraph: false,
      groupBy: '',
      readyReport: [],
      ccpmReport: {},
      P_IS02Result: [],
      showChangeLanguage: false,
      reports: [],
      isLoading: false,
      languages: [{code: 'en', label: 'English'}, {code: 'fr', label: 'French'}],
      languageIndex: 0
    };
    this.store = stores.aggregatedReport;
    autoBind(this);
  }
  componentDidMount () {
    //this.loadReportData();
    this.listenTo(this.store, (e)=>{
        this.loadReportData(e);
    });
  }

  toggleReportLanguageSettings () {
    this.setState({
      showChangeLanguage : !this.state.showChangeLanguage,
    });
  }

  renderCCPMReportButtons () {
    return (
      <bem.FormView__reportButtons>
        <bem.Button
          m='icon' className='report-button__expand right-tooltip'
          onClick={this.toggleFullscreen}
          data-tip={t('Toggle fullscreen')}
        >
          <i className='k-icon-expand' />
        </bem.Button>

        <bem.Button m='icon' className='report-button__print'
                onClick={e => {this.exportToDocx(this.state)}}
                data-tip={t('Export to Document')}>
          <i className='k-icon-download' />
        </bem.Button>
        {
          <bem.Button m='icon' className='report-button__settings'
                  onClick={this.toggleReportLanguageSettings}
                  data-tip={t('Settings')}>
            <i className='k-icon-settings' />
          </bem.Button>
        }
      </bem.FormView__reportButtons>
    );
  }
  loadReportData(items) {
      if(items){
        this.setState({isLoading: true, reports: []});
       items.selectedAssetUids.forEach(uid => {
        stores.allAssets.whenLoaded(uid, (asset)=>{
            let rowsByKuid = {};
            let rowsByIdentifier = {};
            let groupBy = '',
                reportStyles = asset.report_styles,
                reportCustom = asset.report_custom;
            if (
              this.state.currentCustomReport &&
              this.state.currentCustomReport.reportStyle &&
              this.state.currentCustomReport.reportStyle.groupDataBy
            ) {
              groupBy = this.state.currentCustomReport.reportStyle.groupDataBy;
            } else if (reportStyles.default.groupDataBy !== undefined) {
              groupBy = reportStyles.default.groupDataBy;
            }
      
            // TODO: improve the defaults below
            if (reportStyles.default.report_type === undefined) {
              reportStyles.default.report_type = 'vertical';
            }
            if (reportStyles.default.translationIndex === undefined) {
              reportStyles.default.translationIndex = 0;
            }
            if (reportStyles.default.groupDataBy === undefined) {
              reportStyles.default.groupDataBy = '';
            }
      
            if (asset.content.survey != undefined) {
              asset.content.survey.forEach(function(r){
                if (r.$kuid) {
                  rowsByKuid[r.$kuid] = r;
                }
      
                let $identifier = r.$autoname || r.name;
                rowsByIdentifier[$identifier] = r;
              });
      
              // Get the questions' paths automatically from the survey content
              const P_IS03_01Index  = asset.content.survey.findIndex(v => v.name === 'P_IS03_01');
              const groupsBoundaries = asset.content.survey.slice(0, P_IS03_01Index).filter(v => v.type === 'begin_group' || v.type === 'end_group');
      
              const unClosedBoundaries = [];
              groupsBoundaries.filter(v => v.type === 'begin_group').forEach(v => {
                if(!groupsBoundaries.find(r => r.type === 'end_group' && r['$kuid'] === `/${v['$kuid']}`)) unClosedBoundaries.push(v);
              })
      
              let path  = '';
              let pathP_IS02 = '';
              let pathP_IS03 = '';
              unClosedBoundaries.forEach((s,i) => {
                path = `${path}${i > 0 ? '/' : ''}${s.name}`;
                if(i === unClosedBoundaries.length - 2) pathP_IS02 = path;
                if(i === unClosedBoundaries.length - 1) pathP_IS03 = path;
              })
      
              pathP_IS02 = `${pathP_IS02}/P_IS02`;
              pathP_IS03 = `${pathP_IS03}/`;
      
              const fields = [
                pathP_IS02,
                ...ccpm_getQuestionInRange('informingStrategicDecisions','analysisTopicCovered').map(s => `${pathP_IS03}${s}`)
              ];
              
              dataInterface.getSubmissions(uid, 1000,0, [],fields).done((data2) => {
                this.setState({
                  P_IS02Result : data2.results,
                  pathP_IS03,
                  pathP_IS02
                })
              })
      
              dataInterface.getReportData({uid: uid, identifiers: [], group_by: groupBy}).done((data)=> {
                var dataWithResponses = [];
      
                data.list.forEach(function(row){
                  if (row.data.responses || row.data.values || row.data.mean) {
                    if (rowsByIdentifier[row.name] !== undefined) {
                      row.row.label = rowsByIdentifier[row.name].label;
                    } else if (row.name !== undefined) {
                      row.row.label = row.name;
                    } else {
                      row.row.label = t('untitled');
                    }
                    dataWithResponses.push(row);
                  }
                });
      
                let newReport = {};
      
                if(dataWithResponses[0].name === 'type_of_survey') newReport = ccpmReport(dataWithResponses, asset.content);
                this.setState({
                  isLoading: this.state.reports.length +1 < this.store.state.selectedAssetUids.length,
                  reports : [...this.state.reports, {
                  asset: asset,
                  rowsByKuid: rowsByKuid,
                  rowsByIdentifier: rowsByIdentifier,
                  reportStyles: reportStyles,
                  reportData: dataWithResponses || [],
                  reportCustom: reportCustom,
                  translations: asset.content.translations.length > 1 ? true : false,
                  groupBy: groupBy,
                  error: false,
                  ccpmReport: newReport.report,
                  chartData:  newReport.chartData,
                  totalReponses : newReport.totalReponses,
                  totalResponseDisagregatedByPartner: newReport.totalResponseDisagregatedByPartner,
                  totalEffectiveResponse: newReport.totalEffectiveResponse,
                  totalEffectiveResponseDisagregatedByPartner : newReport.totalEffectiveResponseDisagregatedByPartner,
                  questionResponseGroup: newReport.questionResponseGroup}]
                });
              }).fail((err)=> {
                if (groupBy && groupBy.length > 0 && !this.state.currentCustomReport && reportStyles.default.groupDataBy !== undefined) {
                  // reset default report groupBy if it fails and notify user
                  reportStyles.default.groupDataBy = '';
                  this.setState({
                    reportStyles: reportStyles
                  });
                  alertify.error(t('Could not load grouped results via "##". Will attempt to load the ungrouped report.').replace('##', groupBy));
                  this.loadReportData();
                } else {
                  this.setState({
                    error: err,
                    asset: asset
                  });
                }
              });
            } else {
              // Redundant?
              console.error('Survey not defined.');
            }
      });
    })}
  }

  render () {
    const docTitle = 'Global Report'

    if (this.state.isLoading) {
      return (
        <DocumentTitle title={`${docTitle} | Health Cluster`}>
          <bem.Loading>
            {this.state.error ?
              <bem.Loading__inner>
                {t('This report cannot be loaded.')}
                <br/>
                <code>
                  {this.state.error.statusText + ': ' + this.state.error.responseText}
                </code>
              </bem.Loading__inner>
            :
              <bem.Loading__inner>
                <i />
                {t('loading...')}
              </bem.Loading__inner>
            }
          </bem.Loading>
         </DocumentTitle>
      );
    }

    if (!this.state.isLoading && this.state.reports.length === 0) {
      return (
        <DocumentTitle title={`${docTitle} | Health Cluster`}>
          <div style={{width: '100%', height: '100%', padding: '100px'}}>
            <p style={{textAlign: 'center', fontSize: 16, margin: 'auto 0px'}}>Please Select a year and at least two clusters</p>
          </div>
        </DocumentTitle>
      );
    }
      
    if (this.state.isLoading ) {
      return (
        <DocumentTitle title={`${docTitle} | Health Cluster`}>
          <bem.Loading>
            {this.state.error ?
              <bem.Loading__inner>
                {t('This report cannot be loaded.')}
                <br/>
                <code>
                  {this.state.error.statusText + ': ' + this.state.error.responseText}
                </code>
              </bem.Loading__inner>
            :
              <bem.Loading__inner>
                <i />
                {t('loading...')}
              </bem.Loading__inner>
            }
          </bem.Loading>
        </DocumentTitle>
      );
    }

    const formViewModifiers = [];
    if (this.state.isFullscreen) {
      formViewModifiers.push('fullscreen');
    }

    return (
      <DocumentTitle title={`${docTitle} | Health Cluster`}>
        <bem.FormView m={formViewModifiers}>
          <bem.ReportView>
          {this.renderCCPMReportButtons()}
              <bem.ReportView__wrap>
                <bem.PrintOnly>
                  <h3>Aggregated Report</h3>
                </bem.PrintOnly>

                {this.state.reports && <AgregatedReportContents parentState={this.state}  />}
              </bem.ReportView__wrap>
          </bem.ReportView>
          {this.state.showChangeLanguage &&
              <ui.Modal open onClose={this.toggleReportLanguageSettings} title={t('Settings')}>
                <ReportLanguageSettings parentState={this.state} changeLanguage={(index)=>{
                  this.setState({languageIndex: index});
                }} toggleReportGraphSettings = {this.toggleReportLanguageSettings} />
              </ui.Modal>
            }
        </bem.FormView>
      </DocumentTitle>
      );
  }

}

reactMixin(Reports.prototype, mixins.permissions);
reactMixin(Reports.prototype, Reflux.ListenerMixin);

export default Reports;
