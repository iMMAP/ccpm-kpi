import React from 'react';
import dataset, { ccpm_getAverageInQuestion, ccpm_getAverageInBoolQuestion, ccpm_parseNumber, ccpm_getQuestionInRange, titleConstants } from '../ccpmDataset';
import { ccpm_getLabel, ccpm_getStatusLabelBoolean } from '../ccpmReport';
import ReactDOM from 'react-dom';
import { ResponsiveWaffleCanvas } from '@nivo/waffle'
import { ccpm_getName } from '../ccpmReport.es6';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.plugins.register(ChartDataLabels);

export default class CCPM_ReportContents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reportData: [],
      tnslIndex: 0,
      images: {}
    }
    this.setReportData = this.setReportData.bind(this);
    this.getGroupStatus = this.getGroupStatus.bind(this);
    this.getStatusColor = this.getStatusColor.bind(this);
    this.getStatusLabel = this.getStatusLabel.bind(this);
    this.buildChartOptions = this.buildChartOptions.bind(this);
    this.loadChart = this.loadChart.bind(this);
  }
  shouldComponentUpdate(nextProps, nextState) {
    // to improve UI performance, don't refresh report while a modal window is visible
    if (nextProps.parentState.showReportGraphSettings
      || nextProps.parentState.showCustomReportModal
      || nextProps.parentState.currentQuestionGraph) {
      return false;
    } else if (JSON.stringify(this.props.parentState) !== JSON.stringify(nextProps.parentState) || JSON.stringify(this.state.reportData) !== JSON.stringify(nextState.reportData)) {
      return true;
    }
  }

  componentWillUpdate(nextProps, nextState) {

    let reportData = nextProps.reportData;
    var tnslIndex = 0;
    let customReport = this.props.parentState.currentCustomReport,
      defaultRS = this.props.parentState.reportStyles,
      asset = this.props.parentState.asset,
      groupBy = this.props.parentState.groupBy;

    if (customReport) {
      if (customReport.reportStyle && customReport.reportStyle.translationIndex)
        tnslIndex = parseInt(customReport.reportStyle.translationIndex);
    } else {
      tnslIndex = defaultRS.default.translationIndex || 0;
    }

    // reset to first language if trnslt index cannot be found
    if (asset.content.translations && !asset.content.translations[tnslIndex])
      tnslIndex = 0;

    for (var i = reportData.length - 1; i > -1; i--) {
      let _qn = reportData[i].name,
        _type = reportData[i].row.type || null;

      var _defSpec = undefined;

      if (customReport) {
        if (customReport.specified && customReport.specified[_qn])
          _defSpec = customReport.specified[_qn];
      } else {
        _defSpec = defaultRS.specified[_qn];
      }

      if (_defSpec && Object.keys(_defSpec).length) {
        reportData[i].style = _defSpec;
      } else {
        if (customReport && customReport.reportStyle) {
          reportData[i].style = customReport.reportStyle;
        } else {
          reportData[i].style = defaultRS.default;
        }
      }

      if ((_type === 'select_one' || _type === 'select_multiple') && asset.content.choices) {
        let question = asset.content.survey.find(z => z.name === _qn || z.$autoname === _qn);
        let resps = reportData[i].data.responses;
        let choice;
        if (resps) {
          reportData[i].data.responseLabels = [];
          for (var j = resps.length - 1; j >= 0; j--) {
            choice = asset.content.choices.find(o => question && o.list_name === question.select_from_list_name && (o.name === resps[j] || o.$autoname == resps[j]));
            if (choice && choice.label && choice.label[tnslIndex])
              reportData[i].data.responseLabels.unshift(choice.label[tnslIndex]);
            else
              reportData[i].data.responseLabels.unshift(resps[j]);
          }
        } else {
          const vals = reportData[i].data.values;
          if (vals && vals[0] && vals[0][1] && vals[0][1].responses) {
            var respValues = vals[0][1].responses;
            reportData[i].data.responseLabels = [];
            let qGB = asset.content.survey.find(z => z.name === groupBy || z.$autoname === groupBy);
            respValues.forEach(function (r, ind) {
              choice = asset.content.choices.find(o => qGB && o.list_name === qGB.select_from_list_name && (o.name === r || o.$autoname == r));
              reportData[i].data.responseLabels[ind] = (choice && choice.label && choice.label[tnslIndex]) ? choice.label[tnslIndex] : r;
            });

            // TODO: use a better way to store translated labels per row
            for (var vD = vals.length - 1; vD >= 0; vD--) {
              choice = asset.content.choices.find(o => question && o.list_name === question.select_from_list_name && (o.name === vals[vD][0] || o.$autoname == vals[vD][0]));
              vals[vD][2] = (choice && choice.label && choice.label[tnslIndex]) ? choice.label[tnslIndex] : vals[vD][0];
            }
          }
        }
      }
    }

    if (JSON.stringify(reportData) !== JSON.stringify(nextState.reportData)) {
      this.setState({ reportData, tnslIndex });
      this.props.setReadyReportData({ tnslIndex, reportData });
    }

    this.loadChart();
  }

  setReportData(reportData) {
    var tnslIndex = 0;
    let customReport = this.props.parentState.currentCustomReport,
      defaultRS = this.props.parentState.reportStyles,
      asset = this.props.parentState.asset,
      groupBy = this.props.parentState.groupBy;

    tnslIndex = defaultRS.default.translationIndex || 0;

    // reset to first language if trnslt index cannot be found
    if (asset.content.translations && !asset.content.translations[tnslIndex])
      tnslIndex = 0;

    for (var i = reportData.length - 1; i > -1; i--) {
      let _qn = reportData[i].name,
        _type = reportData[i].row.type || null;

      if ((_type === 'select_one' || _type === 'select_multiple') && asset.content.choices) {
        let question = asset.content.survey.find(z => z.name === _qn || z.$autoname === _qn);
        let resps = reportData[i].data.responses;
        let choice;
        if (resps) {
          reportData[i].data.responseLabels = [];
          for (var j = resps.length - 1; j >= 0; j--) {
            choice = asset.content.choices.find(o => question && o.list_name === question.select_from_list_name && (o.name === resps[j] || o.$autoname == resps[j]));
            if (choice && choice.label && choice.label[tnslIndex])
              reportData[i].data.responseLabels.unshift(choice.label[tnslIndex]);
            else
              reportData[i].data.responseLabels.unshift(resps[j]);
          }
        } else {
          const vals = reportData[i].data.ReportContentvalues;
          if (vals && vals[0] && vals[0][1] && vals[0][1].responses) {
            var respValues = vals[0][1].responses;
            reportData[i].data.responseLabels = [];
            let qGB = asset.content.survey.find(z => z.name === groupBy || z.$autoname === groupBy);
            respValues.forEach(function (r, ind) {
              choice = asset.content.choices.find(o => qGB && o.list_name === qGB.select_from_list_name && (o.name === r || o.$autoname == r));
              reportData[i].data.responseLabels[ind] = (choice && choice.label && choice.label[tnslIndex]) ? choice.label[tnslIndex] : r;
            });

            // TODO: use a better way to store translated labels per row
            for (var vD = vals.length - 1; vD >= 0; vD--) {
              choice = asset.content.choices.find(o => question && o.list_name === question.select_from_list_name && (o.name === vals[vD][0] || o.$autoname == vals[vD][0]));
              vals[vD][2] = (choice && choice.label && choice.label[tnslIndex]) ? choice.label[tnslIndex] : vals[vD][0];
            }
          }
        }
      }
    }

    this.setState({ tnslIndex: tnslIndex, reportData: reportData });
    this.props.setReadyReportData({ tnslIndex, reportData });
  }

  componentDidMount() {
    this.setReportData(this.props.reportData);
  }

  getP_IS02Question(choosenLanguage) {
    const { parentState: { P_IS02Result, pathP_IS02, pathP_IS03 } } = this.props;
    const no = P_IS02Result.filter(res => res[pathP_IS02] === 'no');
    const yes = P_IS02Result.filter(res => res[pathP_IS02] === 'yes');
    const yesAverage = [];
    const noAverage = [];
    const keys = ccpm_getQuestionInRange('informingStrategicDecisions', 'analysisTopicCovered').map(s => `${pathP_IS03}${s}`)

    if (yes.length > 0) {
      keys.forEach(key => {
        if (key !== pathP_IS02) {
          let sum = 0;
          let count = 0;
          yes.forEach(v => {
            if (v[key] > 0) {
              sum += ccpm_parseNumber(v[key]);
              count++;
            }
          })
          yesAverage.push({ id: key, average: sum / (count > 0 ? count : 1), averageLabel: this.getStatusLabel(sum / (count > 0 ? count : 1), choosenLanguage) })
        }
      })
    }

    if (no.length > 0) {
      keys.forEach(key => {
        if (key !== pathP_IS02) {
          let sum = 0;
          let count = 0;
          no.forEach(v => {
            if (v[key] > 0) {
              sum += ccpm_parseNumber(v[key]);
              count++;
            }
          })
          noAverage.push({ id: key, average: sum / (count > 0 ? count : 1), averageLabel: this.getStatusLabel(sum / (count > 0 ? count : 1), choosenLanguage) })
        }
      })
    }

    return { yesAverage, noAverage };

  }

  getStatusLabel(average, choosenLanguage) {
    if (average < 1.25) return titleConstants.weak[choosenLanguage];
    if (average < 2.5) return titleConstants.unsatisfactory[choosenLanguage];
    if (average < 3.75) return titleConstants.satifactory[choosenLanguage];
    if (average > 3.75) return titleConstants.good[choosenLanguage];
  }

  getGroupStatus(subgroupName, groupName, choosenLanguage) {
    if (this.props.parentState.ccpmReport[subgroupName]) {
      const average = this.props.parentState.ccpmReport[subgroupName].averageInGroup;
      if (!dataset[groupName][subgroupName].starting) return ccpm_getStatusLabelBoolean(average, choosenLanguage)
      return this.getStatusLabel(average, choosenLanguage);
    }
  }

  getStatusColor(status) {
    if (status === 'Weak') return '#FD625E';
    if (status === 'Unsatisfactory') return '#F9A75D';
    if (status === 'Satisfactory') return '#F5D43E';
    if (status === 'Good') return '#00B8AA';

  }

  getAverageInquestion(data) {
    if (data.data.responses.includes('Yes') || data.data.responses.includes('No')) {
      return ccpm_getAverageInBoolQuestion(data);
    }
    return ccpm_getAverageInQuestion(data);
  }

  buildChartOptions(data, choosenLanguage = 'en') {
    var chartType = 'horizontalBar';

    // TODO: set as default globally in a higher level (PM)

    var baseColor = '#1D6F9C';
    Chart.defaults.global.elements.rectangle.backgroundColor = baseColor;

    let total = 0;
    Object.keys(data).forEach(d => {
      total += data[d];
    });

    if (total === 0) total = 1;

    var datasets = [{
      label: '%',
      axis: 'y',
      data: [(data['1'] / total) * 100, (data['2'] / total) * 100, (data['3'] / total) * 100, (data['4'] / total) * 100, (data['5'] / total) * 100],
      backgroundColor: [
        'rgba(29, 110, 156, 0.8)',
        'rgba(29, 110, 156, 0.8)',
        'rgba(29, 110, 156, 0.8)',
        'rgba(29, 110, 156, 0.8)',
        'rgba(29, 110, 156, 0.8)',
        'rgba(29, 110, 156, 0.8)',
      ],
      borderColor: [
        'rgba(29, 110, 156, 0.8)',
        'rgba(29, 110, 156, 0.8)',
        'rgba(29, 110, 156, 0.8)',
        'rgba(29, 110, 156, 0.8)',
        'rgba(29, 110, 156, 0.8)',
        'rgba(29, 110, 156, 0.8)',
      ],
      borderWidth: 1
    }];

    const labels = {
      en: ['Strongly Disagree', 'Disagree', 'Neither Agree or Disagree', 'Agree', 'Strongly Agree'],
      fr: ['Pas du tout d\'accord', 'Pas d\'accord', 'Neutre', 'D\'accord', 'Vraiment d\'accord']
    }

    var opts = {
      type: chartType,
      data: {
        labels: labels[choosenLanguage],
        datasets
      },
      plugins: [ChartDataLabels],
      options: {
        scales: {
          xAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        },
        legend: {
          display: true
        },
        animation: {
          duration: 500
        },
        plugins: {
          // Change options for ALL labels of THIS CHART
          datalabels: {
            color: '#fff',
            formatter: function (value, context) {
              const percent = Number.parseFloat(value).toFixed(2);
              return percent > 0 ? `${percent}%` : '';
            },
            clamp: true,
            align: 'center'
          }
        },
        indexAxis: 'y',
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              return `${Number.parseFloat(`${tooltipItem.value}`).toFixed(2)}%`;
            },
          }
        }
      }
    };

    return opts;
  }

  loadChart() {
    const { parentState } = this.props;
    const { reportStyles, asset: { content: { translations } } } = parentState;
    let currentLanguageIndex = reportStyles.default.translationIndex;
    if(!translations[currentLanguageIndex]) currentLanguageIndex = translations.findIndex(lan => lan && lan.includes('en'));
    const choosenLanguage = translations ? ((translations[currentLanguageIndex]).match(/\(.*?\)/))[0].replace('(', '').replace(')', '') : 'en';

    Object.keys(dataset).forEach(element => {
      if (element !== 'code') {
        var canvas = ReactDOM.findDOMNode(this.refs[`canvas${element}`]);
        var opts = this.buildChartOptions(this.props.parentState.questionResponseGroup[element], choosenLanguage);

        if (this[`itemChart-${element}`]) {
          this[`itemChart-${element}`].destroy();
          this[`itemChart-${element}`] = new Chart(canvas, opts);
        } else {
          this[`itemChart-${element}`] = new Chart(canvas, opts);
        }
      }
    })
  }

  renderComment(questionCode, questionName) {
    const data = this.props.reportData.find(q => q.name === questionCode);
    if (!data) return '';
    return <table style={{ width: '95%', marginLeft: '40px', borderCollapse: 'collapse' }}>
      <tbody>
        {questionName && <tr><td style={{ fontSize: '14px', color: 'black', fontWeight: 'bold', paddingTop: '20px', paddingBottom: '10px' }}>{questionName}</td></tr>}
        {data.data.responseLabels && data.data.responseLabels.map((response, index) => {
          return <tr>
            <td className='report_tr_left_with_border'>{response}</td>
          </tr>
        })}
        {!data.data.responseLabels && data.data.responses.map((response, index) => {
          return <tr>
            <td className='report_tr_left_with_border'>{response}</td>
          </tr>
        })}
      </tbody>
    </table>
  }

  calculatePercentage(total, sum) {
    if (isNaN(total)) total = 0;
    if (isNaN(sum)) sum = 1;
    return (total / sum) * 100;
  }

  render() {
    const { parentState } = this.props;
    const { totalReponses: { numberOfPartner }, reportStyles, asset: { content: { translations } } } = parentState;
    let currentLanguageIndex = reportStyles.default.translationIndex;
    if(!translations[currentLanguageIndex]) currentLanguageIndex = translations.findIndex(lan => lan && lan.includes('en'));
    const choosenLanguage = translations ? ((translations[currentLanguageIndex]).match(/\(.*?\)/))[0].replace('(', '').replace(')', '') : 'en';
    const P_IS02Result = this.getP_IS02Question(choosenLanguage);
    const overallTotalResponsesPercentage = Math.floor(this.calculatePercentage(numberOfPartner, this.props.parentState.totalReponses.sum));
    const efectiveTotalResponsesPercentage = Math.floor(this.calculatePercentage(numberOfPartner, this.props.parentState.totalEffectiveResponse.sum));
    return (
      <div id='document-report' style={{ paddingBottom: '100px' }} >
        <h1 className="bigTitle">{titleConstants.overallResponseRate[choosenLanguage]}</h1>
        <h1 className="title" style={{marginTop: '22px' }}>{titleConstants.totalResponse[choosenLanguage]}</h1>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ height: '150px', width: "60%" }}>
              <div style={{ height: '100%', width: '100%', display: 'inline-block' }} ref='totalResponseChart' id='totalResponseChart' >
                <ResponsiveWaffleCanvas
                  data={[
                    {
                      "id": "totalReponse",
                      "label": "Total Responses (%)",
                      "value": overallTotalResponsesPercentage,
                      "color": "#097ca8"
                    }
                  ]}
                  pixelRatio={1}
                  total={100}
                  rows={5}
                  columns={20}
                  fillDirection="left"
                  padding={2}
                  margin={{ top: 0, right: 10, bottom: 0, left: 5 }}
                  colors={["#097ca8", "#dedede"]}
                  borderColor={{ from: 'color', modifiers: [['darker', 0.3]] }}
                  emptyColor="#dedede"
                />
              </div>
            </div>
            <table style={{ width: '30%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td className='report_tr_left_with_border'>Total</td>
                  <td className='report_tr_right_with_border' style={{ color: overallTotalResponsesPercentage > 100 ? '#FD625E' : '#000' }}>{overallTotalResponsesPercentage}%</td>
                </tr>
                <tr>
                  <td className='report_tr_left_with_border'>{titleConstants.numberPartnerResponding[choosenLanguage]}</td>
                  <td className='report_tr_right_with_border' >{this.props.parentState.totalReponses.numberOfPartner}</td>
                </tr>
                <tr>
                  <td className='report_tr_left_with_border'>{titleConstants.totalNumberOfPartner[choosenLanguage]}</td>
                  <td className='report_tr_right_with_border' >{this.props.parentState.totalReponses.sum}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <h1 className="title">{titleConstants.responseByType[choosenLanguage]}</h1>
        {
          parentState.totalResponseDisagregatedByPartner.map((v, i) => <>
            <div style={{ width: '50%', display: 'inline-block', height: '150px' }}>
              <h1 className="subtitle" style={{ marginLeft: '10px', color: this.calculatePercentage(v.questionsDisagregatedByPartner, v.data.mean) > 100 ? '#FD625E' : '#000' }}> {ccpm_getLabel(currentLanguageIndex, v.row.label)} ({Math.floor(this.calculatePercentage(v.questionsDisagregatedByPartner, v.data.mean))}%)</h1>
              <div ref={`chart-${i}`} id={`chart-${i}`} style={{ height: "80%", width: "95%" }}>
                <ResponsiveWaffleCanvas
                  data={[
                    {
                      "id": "totalReponse",
                      "label": v.row.label[0] + " (%)",
                      "value": Math.floor(this.calculatePercentage(v.questionsDisagregatedByPartner, v.data.mean)) > 100 ? 100 : Math.floor(this.calculatePercentage(v.questionsDisagregatedByPartner, v.data.mean)),
                      "color": "#097ca8"
                    }
                  ]}
                  pixelRatio={1}
                  total={100}
                  rows={5}
                  fillDirection="left"
                  columns={20}
                  padding={2}
                  margin={{ top: 0, right: 0, bottom: 10, left: 0 }}
                  colors={["#097ca8", "#dedede"]}
                  borderColor={{ from: 'color', modifiers: [['darker', 0.3]] }}
                  emptyColor="#dedede"
                />
              </div>
            </div>
          </>
          )
        }

        <h1 className="bigTitle" style={{ pageBreakBefore: 'always' }}>{titleConstants.effectiveResponseRate[choosenLanguage]}</h1>

        <h1 className="title" style={{marginTop: '22px' }}>{titleConstants.totalResponse[choosenLanguage]}</h1>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div ref='totalEffectiveResponseChart' style={{ margin: 0, padding: 0, width: '60%', height: '150px' }} id='totalEffectiveResponseChart' >
            <ResponsiveWaffleCanvas
              data={[
                {
                  "id": "totalReponse",
                  "label": "Total Responses (%)",
                  "value": efectiveTotalResponsesPercentage,
                  "color": "#097ca8"
                }
              ]}
              pixelRatio={1}
              total={100}
              rows={5}
              columns={20}
              fillDirection="left"
              padding={2}
              margin={{ top: 0, right: 10, bottom: 0, left: 5 }}
              colors={["#097ca8", "#dedede"]}
              borderColor={{ from: 'color', modifiers: [['darker', 0.3]] }}
              emptyColor="#dedede"
            />
          </div>
          <table style={{ width: '30%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td className='report_tr_left_with_border'>Total</td>
                <td className='report_tr_right_with_border' style={{ color: efectiveTotalResponsesPercentage > 100 ? '#FD625E' : '#000' }}>{efectiveTotalResponsesPercentage}%</td>
              </tr>
              <tr>
                <td className='report_tr_left_with_border'>{titleConstants.numberPartnerResponding[choosenLanguage]}</td>
                <td className='report_tr_right_with_border' >{this.props.parentState.totalEffectiveResponse.numberOfPartner}</td>
              </tr>
              <tr>
                <td className='report_tr_left_with_border'>{titleConstants.totalNumberOfPartner[choosenLanguage]}</td>
                <td className='report_tr_right_with_border' >{this.props.parentState.totalEffectiveResponse.sum}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <h1 className="title">{titleConstants.responseByType[choosenLanguage]}</h1>
        {
          parentState.totalEffectiveResponseDisagregatedByPartner.map((v, i) => <>
            <div style={{ width: '50%', display: 'inline-block', height: '150px' }}>
              <h1 className="subtitle" style={{ marginLeft: '10px', color: this.calculatePercentage(v.questionsDisagregatedByPartner, v.data.mean) > 100 ? '#FD625E' : '#000' }}> {ccpm_getLabel(currentLanguageIndex, v.row.label)} ({Math.floor(this.calculatePercentage(v.questionsDisagregatedByPartner, v.data.mean))}%)</h1>
              <div ref={`chart2-${i}`} id={`chart2-${i}`} style={{ height: "80%", width: "95%" }}>
                <ResponsiveWaffleCanvas
                  data={[
                    {
                      "id": "totalReponse",
                      "label": v.row.label[0] + " (%)",
                      "value": Math.floor(this.calculatePercentage(v.questionsDisagregatedByPartner, v.data.mean)) > 100 ? 100 : Math.floor(this.calculatePercentage(v.questionsDisagregatedByPartner, v.data.mean)),
                      "color": "#097ca8"
                    }
                  ]}
                  pixelRatio={1}
                  total={100}
                  rows={5}
                  fillDirection="left"
                  columns={20}
                  padding={2}
                  margin={{ top: 0, right: 10, bottom: 10, left: -5 }}
                  colors={["#097ca8", "#dedede"]}
                  borderColor={{ from: 'color', modifiers: [['darker', 0.3]] }}
                  emptyColor="#dedede"
                />
              </div>
            </div>
          </>
          )
        }
        <h1 className="bigTitle" style={{ pageBreakBefore: 'always' }}>{titleConstants.overallPerformance[choosenLanguage]}</h1>

        {Object.keys(dataset).map(group => {
          return (
            <>
              <h1 className="title" style={{paddingTop: '15px'}}>{ccpm_getName(dataset[group], choosenLanguage)}</h1>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {
                    Object.keys(dataset[group]).map(subGroup => {
                      if (subGroup === 'code' || subGroup === 'name' || subGroup === 'names' || subGroup === 'comments' || !dataset[group][subGroup]) return;
                      return <tr key={subGroup}>
                        <td className='report_tr_left'>{ccpm_getName(dataset[group][subGroup], choosenLanguage)}</td>
                        <td className='report_tr_right' style={{ color: this.getStatusColor(this.getGroupStatus(subGroup, group, 'en')) }}>{this.getGroupStatus(subGroup, group, choosenLanguage)}</td>
                      </tr>
                    })
                  }
                </tbody>
              </table>
            </>)
        })}

        <h1 className="bigTitle" style={{ pageBreakBefore: 'always' }}>{titleConstants.scoreBreakdown[choosenLanguage]}</h1>

        {Object.keys(dataset).map(group => {
          return (
            <>
              <h1 className="title" style={{paddingTop: '15px'}}>{ccpm_getName(dataset[group], choosenLanguage)}</h1>
              {Object.keys(dataset[group]).map(subGroup => {
                if (!parentState.ccpmReport[subGroup].questions || subGroup === 'code' || subGroup === 'names' || subGroup === 'name' || subGroup === 'comments') return '';
                return <>

                  <p className="subtitleScore">{ccpm_getName(dataset[group][subGroup], choosenLanguage)}</p>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      {subGroup === 'analysisTopicCovered' ?
                        parentState.ccpmReport[subGroup].questions.map((question, index) => {
                          const questionYes = P_IS02Result.yesAverage.find(f => f.id.includes(question.name)) || {}
                          const questionNo = P_IS02Result.noAverage.find(f => f.id.includes(question.name)) || {};
                          return <>
                            {index === 0 && <tr key={ccpm_getLabel(question.row.label, currentLanguageIndex)}>
                              <td className='report_tr_left_1' style={{ fontWeight: 'bold', verticalAlign: 'center' }}> {titleConstants.topic[choosenLanguage]}</td>
                              <td className='report_tr_middle' style={{ fontWeight: 'bold', verticalAlign: 'center' }}>{titleConstants.haveDoneSituationAnalysis[choosenLanguage]}</td>
                              <td className='report_tr_right_1' style={{ fontWeight: 'bold', verticalAlign: 'center' }}>{titleConstants.haveNotDoneSituationAnalysis[choosenLanguage]}</td>
                            </tr>}
                            <tr key={question.row.label[0]}>
                              <td className='report_tr_left_1'>{ccpm_getLabel(currentLanguageIndex, question.row.label)}</td>
                              <td className='report_tr_middle' style={{ color: this.getStatusColor(this.getStatusLabel(questionYes.average, 'en')) }}>{questionYes.averageLabel}</td>
                              <td className='report_tr_right' style={{ color: this.getStatusColor(this.getStatusLabel(questionNo.average, 'en')) }}>{questionNo.averageLabel}</td>
                            </tr>
                            <tr style={{ width: '100%', paddingLeft: '40px' }}>
                              {(dataset[group][subGroup].notes && (parentState.ccpmReport[subGroup].questions.length - 1 === index)) && dataset[group][subGroup].notes.map((question, index2) => {

                                return <>
                                  {(index2 === 0 && dataset[group][subGroup].noteName) && <h2 className="comment-title">{ccpm_getName(dataset[group][subGroup].noteName, choosenLanguage)}</h2>}
                                  {this.renderComment(question.code, ccpm_getLabel(currentLanguageIndex, (parentState.reportData.find(q => q.name === question.code)) ? parentState.reportData.find(q => q.name === question.code).row.label : ['']))}
                                </>
                              })}
                            </tr>
                          </>
                        }) :
                        parentState.ccpmReport[subGroup].questions.map((question, index) => {
                          return <>
                            <tr key={question.row.label[0]}>
                              <td className='report_tr_left'>{ccpm_getLabel(currentLanguageIndex, question.row.label)}</td>
                              <td className='report_tr_right' style={{ color: this.getStatusColor(question.averageLabel) }}>{this.getStatusLabel(question.average, choosenLanguage)}</td>
                            </tr>
                            <tr style={{ width: '100%', paddingLeft: '40px' }}>
                              {(dataset[group][subGroup].notes && (parentState.ccpmReport[subGroup].questions.length - 1 === index)) && dataset[group][subGroup].notes.map((question, index2) => {
                                return <>
                                  {(index2 === 0 && dataset[group][subGroup].noteName) && <h2 className="comment-title">{dataset[group][subGroup].noteName[choosenLanguage]}</h2>}
                                  {this.renderComment(question.code, ccpm_getLabel(currentLanguageIndex, (this.props.parentState.reportData.find(q => q.name === question.code)) ? this.props.parentState.reportData.find(q => q.name === question.code).row.label : ['']))}
                                </>
                              })}
                            </tr>
                          </>
                        })
                      }
                    </tbody>
                  </table>
                </>
              })}
            </>)
        })}
        <h1 className="bigTitle" style={{ pageBreakBefore: 'always' }}>{titleConstants.qustionByquestionBreakdown[choosenLanguage]}</h1>
        {
          Object.keys(dataset).map(element => {
            if (element !== 'code' && element !== 'name') {
              return <>
                <h1 className="title" style={{ marginLeft: '10px', paddingTop: '20px' }}> {ccpm_getName(dataset[element], choosenLanguage)}</h1>
                <canvas ref={`canvas${element}`} id={`${element}canv`} />
                {this.renderComment(dataset[element].comments[0], titleConstants.commentSuggestedImprovment[choosenLanguage])}
                {this.renderComment(dataset[element].comments[1], titleConstants.commentSuccessStories[choosenLanguage])}
              </>
            }
          })
        }
        <h1 className="bigTitle" style={{ pageBreakBefore: 'always', paddingBottom: '22px' }}>{titleConstants.finalComments[choosenLanguage]}</h1>
        {this.renderComment('P_OI01', titleConstants.partner[choosenLanguage])}
        
        {this.renderComment('C_OI01', titleConstants.coordinator[choosenLanguage])}
      </div>
    );
  }
};
