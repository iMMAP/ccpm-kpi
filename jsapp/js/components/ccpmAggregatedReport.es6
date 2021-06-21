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


import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.plugins.register(ChartDataLabels);


class AgregatedReportContents extends React.Component {
  constructor(props) {
    super(props);
    this.state= {
      reportData: [], 
      tnslIndex:0
    }
  }


  componentDidMount(){
    this.loadChart();
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
    return regions;
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
    const { reportStyles, asset: { content: { translations } }} = report;
    let currentLanguageIndex = currentLanguageIndex = translations.findIndex(lan => lan && lan.includes('en')); // reportStyles.default.translationIndex;
    //if(!translations[currentLanguageIndex]) currentLanguageIndex = translations.findIndex(lan => lan && lan.includes('en'));
    return currentLanguageIndex;
  }

  calculatePercentage(total, sum) {
    if (isNaN(total)) total = 0;
    if (isNaN(sum) || sum === 0) return 0;
    return (total / sum) * 100;
  }

  buildPartnerByTypeOptions() {

    const data = {};

    this.props.parentState.reports.forEach(rep => {
      const languageIndex = this.getLanguageIndex(rep);
      rep.totalResponseDisagregatedByPartner.forEach(element=>{
        const label = element.row.label[languageIndex] || element.row.label[1];

        if(element.data.provided > 0){
        if(data[label])data[label]+=element.questionsDisagregatedByPartner;
        else data[label] = element.questionsDisagregatedByPartner;
        }
      })
    })
    
    var chartType = 'horizontalBar';

    // TODO: set as default globally in a higher level (PM)

    var baseColor = '#1f5782';
    Chart.defaults.global.elements.rectangle.backgroundColor = baseColor;

    var datasets = [{
      label: '%',
      axis: 'y',
      data: Object.keys(data).map(e=>{
        return (data[e] / (Object.values(data).reduce((a,b)=>a+b) || 1)) * 100;
      }),
      backgroundColor: [
        'rgb(31,87,130)',
      ],
      borderColor: [
        'rgba(29, 110, 156, 0.8)',
      ],
      borderWidth: 0
    }];

    const labels = Object.keys(data);

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

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  buildPartnerByTypeAndRegionOptions() {

    const data = {};
    const totalRegion = {};

    this.props.parentState.reports.forEach(rep => {
      const languageIndex = this.getLanguageIndex(rep);
      const ccpmData = JSON.parse(rep.asset.settings.ccpmData);
      if(ccpmData.region){
      rep.totalResponseDisagregatedByPartner.forEach(element=>{
        const label = element.row.label[languageIndex] || element.row.label[1];
        if(!data[label]) data[label] = {};
        if(element.data.provided > 0){
        if(data[label][ccpmData.region.label])data[label][ccpmData.region.label]+=element.questionsDisagregatedByPartner;
        else data[label][ccpmData.region.label] = element.questionsDisagregatedByPartner;
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
      label: key,
      data: Object.keys(data[key]).map(e=>{
        return (data[key][e] / (totalRegion[e])) * 100;
      }),
      borderWidth: 1,
      backgroundColor: colors[index]

    })});

    let labels = [];
    if(Object.keys(data).length > 0) 
    labels = Object.keys(data[Object.keys(data)[0]]);

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

    this.props.parentState.reports.forEach(rep => {
      const { totalReponses: { numberOfPartner, sum } } = rep;
      const ccpmData = JSON.parse(rep.asset.settings.ccpmData);
      if(ccpmData.region){
        if(!colors[ccpmData.region.label]) colors[ccpmData.region.label] = this.getRandomColor();
        if(ccpmData.cluster){
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
        return this.calculatePercentage(data[key].total, data[key].expected );
      }),
      borderWidth: 1,
      backgroundColor: Object.keys(data).map(e => data[e].color)
    });

    let labels = Object.keys(data);

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
          for (var i = 0; i < Object.keys(colors).length; i++) { 
              text.push('<li style="display:inline-block; margin-left: 10px"><span style="height:10px;width:10px;margin-right:8px;display:inline-block;background-color:' + 
                         colors[Object.keys(colors)[i]] + 
                         '"></span>'); 
              if (Object.keys(colors)[i]) { 
                  text.push(Object.keys(colors)[i]); 
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
            label: function () {
              return `${name} (%): ${data}`;
            },
            caretSize: 0
          },
          displayColors: false
        }
        }
    };

    return opts;
  }

  loadChart() {

    var canvas = ReactDOM.findDOMNode(this.refs[`chartbyType`]);
    var opts = this.buildPartnerByTypeOptions([], 'en');

    if (this[`itemChart-chartByType`]) {
      this[`itemChart-chartByType`].destroy();
      this[`itemChart-chartByType`] = new Chart(canvas, opts);
    } else {
      this[`itemChart-chartByType`] = new Chart(canvas, opts);
    }

     canvas = ReactDOM.findDOMNode(this.refs[`chartbyTypeAndRegion`]);
     opts = this.buildPartnerByTypeAndRegionOptions([], 'en');

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
  
    return (
      <div id='document-report'>
        <h1 className="bigTitle">{titleConstants.completionAndResponseRate['en']}</h1>
        <h1 className="title" style={{marginTop: '22px' }}>{titleConstants.overallCompletionRate['en']}</h1>
        <table style={{ borderCollapse: 'collapse', width: '75%', margin: '30px auto' }}>
          <thead>
            <th style={{color: '#ffffff', minWidth: '100px'}}>region</th>
            <th className="agregatedTableTitle">National Level</th>
            <th className="agregatedTableTitle">Sub National</th>
            <th className="agregatedTableTitle">Coordinator responses</th>
            <th className="agregatedTableTitle">Partners responses</th>
          </thead>
              <tbody>
              {completionRateRegions.map(rg => <tr>
                  <td className="agregatedTableTitle">{rg.name}</td>
                  <td className="agregatedTableContent">{this.getNationalLevel(rg.reports)}</td>
                  <td className="agregatedTableContent">{this.getSubNationalLevel(rg.reports)}</td>
                  <td className="agregatedTableContent">{this.getCoordinatorOrPartnerResponses(rg.reports, 'coordinator')}</td>
                  <td className="agregatedTableContent">{this.getCoordinatorOrPartnerResponses(rg.reports, 'partner')}</td>
                </tr>
              )}
              </tbody>
            </table>
            <h1 className="title" style={{paddingTop: '20px', paddingBottom: '10px' }}>{titleConstants.responseRateByRegionAndType['en']}</h1>
            <div style={{ width: '75%', margin: '20px auto', border: "1px #000 solid", padding: '20px'}}>
              <canvas ref={`chartbyType`} id={`chartbyType`} />
            </div>
            <h1 className="title" style={{paddingTop: '22px', paddingBottom: '10px' }}>{titleConstants.partnerByRegion['en']}</h1>
            <div style={{ width: '75%', margin: '20px auto', border: "1px #000 solid", padding: '20px'}}>
              <canvas ref={`chartbyTypeAndRegion`} id={`chartbyTypeAndRegion`} />
            </div>
            <h1 className="title" style={{paddingTop: '22px', paddingBottom: '10px' }}>Response Rate by Country</h1>
            <div style={{ width: '75%', margin: '20px auto', border: "1px #000 solid", padding: '20px'}}>
              <canvas ref={`chartbyCluster`} id={`chartbyCluster`} />
              <div style={{margin: '0px auto', textAlign:'center', alignContent: 'center'}} id="custom-legend"/>
            </div>
         
      </div>
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
      reports: []
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
  loadReportData(items) {
      if(items){
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
                this.setState({reports : [...this.state.reports, {
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
    if (this.state.reports.length === 0) {
      return (
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
      );
    }

    let asset = this.state.asset,
        docTitle;

    if (asset && asset.content)
      docTitle = asset.name || t('Untitled');

    if (this.state.reports.length < this.store.state.selectedAssetUids.length) {
      return (
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
              <bem.ReportView__wrap>
                <bem.PrintOnly>
                  <h3>Aggregated Report</h3>
                </bem.PrintOnly>

                {this.state.reports && <AgregatedReportContents parentState={this.state}  />}
              </bem.ReportView__wrap>
          </bem.ReportView>
        </bem.FormView>
      </DocumentTitle>
      );
  }

}

reactMixin(Reports.prototype, mixins.permissions);
reactMixin(Reports.prototype, Reflux.ListenerMixin);

export default Reports;
