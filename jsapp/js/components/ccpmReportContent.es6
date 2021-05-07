import React from 'react';
import dataset, {ccpm_getAverageInQuestion, ccpm_getAverageInBoolQuestion} from '../ccpmDataset';
import ReactDOM from 'react-dom';
import d3Waffle, {slugify} from '../d3Waffle';
import * as d3 from 'd3';

export default class CCPM_ReportContents extends React.Component {
    constructor(props) {
      super(props);
      this.state= {
        reportData: [], 
        tnslIndex:0,
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
      } else if(JSON.stringify(this.props.parentState) !== JSON.stringify(nextProps.parentState) || JSON.stringify(this.state.reportData) !== JSON.stringify(nextState.reportData)) {
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
              respValues.forEach(function(r, ind){
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
       this.setState({reportData, tnslIndex});
      this.props.setReadyReportData({tnslIndex,reportData});
      }
  
      this.loadChart();
    }
    
    setReportData(reportData){
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
              respValues.forEach(function(r, ind){
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
  
      this.setState({tnslIndex: tnslIndex, reportData: reportData});
      this.props.setReadyReportData({tnslIndex,reportData});
    }
  
    componentDidMount(){
      this.setReportData(this.props.reportData);
    }
  
    getStatusLabel(average){
      if(average < 1.25) return 'Weak';
      if(average < 2.5) return 'Unsatisfactory';
      if(average < 3.75) return 'Satisfactory';
      if(average > 3.75) return 'Good'; 
    }
  
    getGroupStatus(groupName){
      if(this.props.parentState.ccpmReport[groupName]){
        const average = this.props.parentState.ccpmReport[groupName].averageInGroup;
        return this.getStatusLabel(average);
      }
    }
  
    getStatusColor(status) {
      if(status === 'Weak') return '#FD625E';
      if(status === 'Unsatisfactory') return '#F9A75D';
      if(status === 'Satisfactory') return '#F5D43E';
      if(status === 'Good') return '#00B8AA';
  
    }
  
    getAverageInquestion(data) {
      if(data.data.responses.includes('Yes') || data.data.responses.includes('No')){
        return ccpm_getAverageInBoolQuestion(data);
      } 
      return ccpm_getAverageInQuestion(data);
    }
  
    buildChartOptions (data) {
      var chartType = 'horizontalBar';
  
      // TODO: set as default globally in a higher level (PM)
  
      var baseColor = '#1D6F9C';
      Chart.defaults.global.elements.rectangle.backgroundColor = baseColor;
  
      var datasets = [{
        label: '# of questions',
        axis: 'y',
        data: [data['1'], data['2'],data['3'],data['4'],data['5']],
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
  
  
      var opts = {
        type: chartType,
        data: {
            labels: ['Strongly Disagree', 'Disagree', 'Neither Agree or Disagree', 'Agree', 'Strongly Agree'],
            datasets
        },
        options: {
          // events: [''],
          legend: {
            display: true
          },
          animation: {
            duration: 500
          },
          indexAxis: 'y',
        }
      };
  
      return opts;
    }
  
    getChart(name, total = 1, sum = 0, height, colorRange = ['#097ca8', '#dedede']) {
      if(isNaN(total) || total === 0 ) total = 1;
      if(isNaN(sum)) sum = 0;
      let coveredValue = sum / total;
      coveredValue = coveredValue * 100;
  
      var data = [
        { "name": `${Math.floor(coveredValue)}%`, "value": coveredValue > 100 ? 100 : coveredValue},
        { "name": `${Math.floor(coveredValue > 100 ? 0 : 100-coveredValue)}%`, "value": coveredValue > 100 ? 0 : 100-coveredValue},
      ];
  
      var domain = data.map(function(d){ return slugify(d.name); })
      var palette = d3.scale.ordinal().domain(domain).range(colorRange); 
  
      let chart = d3Waffle(`${name}svg`).rows(5);
      chart.colorscale(palette);
      chart = chart.height(height || 120);
      
  
      if(document.getElementById(name)){
        const el = d3.select(`#${name}`)
          .datum(data)
          .call(chart);
      }
  }
  
    getByTypeChart(){
      const globalQuestion = this.props.parentState.reportData.find(e => e.name === 'P_GI03');
      const data = globalQuestion.data.frequencies.map((v, index)=>{
        return {value:(v / globalQuestion.data.provided)*100, name: globalQuestion.data.responses[index]}
      });
  
      let chart = d3Waffle(`bytypesvg`,true).rows(5);
      chart = chart.height(150);
  
      if(document.getElementById('totalResponseChartByType')){
      d3.select('#totalResponseChartByType')
        .datum(data)
        .call(chart);
      }
    }
  
    loadChart() {
      Object.keys(dataset).forEach(element => {
        if(element !== 'code'){
        var canvas = ReactDOM.findDOMNode(this.refs[`canvas${element}`]);
        var opts = this.buildChartOptions(this.props.parentState.questionResponseGroup[element]);
    
        if (this[`itemChart-${element}`]) {
          this[`itemChart-${element}`].destroy();
          this[`itemChart-${element}`] = new Chart(canvas, opts);
        } else {
          this[`itemChart-${element}`] = new Chart(canvas, opts);
        }}
      })
  
      this.getChart('totalResponseChart', this.props.parentState.totalReponses.numberOfPartner, this.props.parentState.totalReponses.sum);
      this.getChart('totalEffectiveResponseChart', this.props.parentState.totalEffectiveResponse.numberOfPartner, this.props.parentState.totalEffectiveResponse.sum);
  
      this.getByTypeChart();
  
      this.props.parentState.totalResponseDisagregatedByPartner.forEach((v,i) => {
        this.getChart(`chart-${i}`, v.questionsDisagregatedByPartner, v.data.mean, 100);
      })
      this.props.parentState.totalEffectiveResponseDisagregatedByPartner.forEach((v,i) => {
        this.getChart(`chart2-${i}`, v.questionsDisagregatedByPartner, v.data.mean,100);
      })
    }
  
    renderComment(questionCode, questionName) {
      const data =  this.props.parentState.reportData.find(q => q.name === questionCode);
      if(!data) return '';
      if(data.row.type === 'select_one') {
        return <table style={{ width: '100%',marginLeft: '40px', borderCollapse: 'collapse'}}>
                  <tbody>
                    <tr><td style={{fontSize: '15px', color: 'black', fontWeight: 'bold', marginTop: '10px', paddingBottom: '10px'}}>{questionName}</td></tr>
                    {data.data.responses.map((response, index) => {
                      return  <tr>
                                  <td className='report_tr_left_with_border'>{response}</td>
                                  <td className='report_tr_right_with_border' >{data.data.percentages[index]} %</td>
                              </tr>
                    })}
                  </tbody>
                </table>
      } 
      if(data.row.type === 'text') {
        return <table style={{ width: '100%', marginLeft: '40px', borderCollapse: 'collapse'}}>
                  <tbody>
                    <tr><td style={{fontSize: '15px', color: 'black', fontWeight: 'bold', paddingTop: '10px', paddingBottom: '10px'}}>{questionName}</td></tr>
                      {data.data.responses.map(response => {
                        return  <tr>
                                    <td className="bordered-td">{response}</td>
                                </tr>
                      })}
                  </tbody>
                </table>
      }
    }
  
    render () {
      const {parentState} = this.props;
      const {totalReponses: {numberOfPartner}} = parentState;
      this.props.parentState.totalReponses.numberOfPartner
      return (
        <div id='document-report' >
          <h1 className="bigTitle">Overall Response Rate</h1>
          <h1 className="title"> Overall Active Partners Response Rate</h1>
          <div>
            <div>
              <div style={{margin: 0, padding: 0, width: '60%', display:'inline-block'}} ref='totalResponseChart' id='totalResponseChart' />
              <table style={{width: '39%', borderCollapse: 'collapse',display: 'inline-block'}}>
                <tbody>
                    <tr>
                      <td className='report_tr_left_with_border'>Total</td>
                      <td className='report_tr_right_with_border' >{Math.floor((this.props.parentState.totalReponses.sum / (numberOfPartner  === 0 ? 1 : numberOfPartner) * 100))}%</td>
                    </tr>
                    <tr>
                        <td className='report_tr_left_with_border'>Tot. Number of Partners</td>
                        <td className='report_tr_right_with_border' >{this.props.parentState.totalReponses.numberOfPartner}</td>
                    </tr>
                    <tr>
                        <td className='report_tr_left_with_border'>Tot. Partners Responding</td>
                        <td className='report_tr_right_with_border' >{this.props.parentState.totalReponses.sum}</td>
                    </tr>
                </tbody>
              </table>
            </div>
         </div>
         <canvas id="testCanvas" />
         <h1 className="title"> Overall Active Partners Response Rate by type</h1>
        <div>
          <div style={{ textAlign: 'center', display: 'inline-block'}}>
          
          <div style={{margin: 0, padding: 0}} ref='totalResponseChartByType' id='totalResponseChartByType' />
          </div>
        </div>
        {
          parentState.totalResponseDisagregatedByPartner.map((v,i) => <>
          <div style={{width: '50%',display: 'inline-block'}}>
            <h1 className="subtitle" style={{marginLeft: '10px'}}> {v.row.label[0]}  ({ isNaN(v.questionsDisagregatedByPartner) || v.questionsDisagregatedByPartner === 0 ? '' : Math.floor((v.data.mean || 0 /(isNaN(v.questionsDisagregatedByPartner)) ? 1 : v.questionsDisagregatedByPartner) * 100)}) %</h1>
            <div ref={`chart-${i}`} id={`chart-${i}`} />
          </div>
          </>
          )
        }
  
         <h1 className="bigTitle">Effective Response Rate</h1>
  
        <h1 className="title">Total Effective Response</h1>
        <div ref='totalEffectiveResponseChart' style={{margin: 0, padding: 0, width: '60%', display:'inline-block'}}  id='totalEffectiveResponseChart' />      
        <table style={{width: '39%', borderCollapse: 'collapse',display: 'inline-block'}}>
                <tbody>
                <tr>
                    <td className='report_tr_left_with_border'>Total</td>
                    <td className='report_tr_right_with_border' >{Math.floor((this.props.parentState.totalEffectiveResponse.sum / (numberOfPartner  === 0 ? 1 : numberOfPartner)) * 100)}%</td>
                </tr>
                <tr>
                    <td className='report_tr_left_with_border'>Tot. Number of Partners</td>
                    <td className='report_tr_right_with_border' >{this.props.parentState.totalEffectiveResponse.numberOfPartner}</td>
                </tr>
                <tr>
                    <td className='report_tr_left_with_border'>Tot. Partners Responding</td>
                    <td className='report_tr_right_with_border' >{this.props.parentState.totalEffectiveResponse.sum}</td>
                </tr>
                </tbody>
          </table>
        {
          parentState.totalEffectiveResponseDisagregatedByPartner.map((v,i) => <>
            <div style={{width: '50%', display: 'inline-block'}}>
              <h1 className="subtitle" style={{marginLeft: '10px'}}> {v.row.label[0]}</h1>
              <div ref={`chart2-${i}`} id={`chart2-${i}`} />
            </div>
          </>
          )
        }
  
  
          {Object.keys(dataset).map(group => {
          return (
            <>
            <h1 className="title">{dataset[group].name}</h1>
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
              <tbody>
                 {
                    Object.keys(dataset[group]).map(subGroup => {
                      if(subGroup === 'code' || subGroup === 'name' || subGroup === 'comments' || !dataset[group][subGroup]) return ;
                      return <tr key={subGroup}>
                      <td className='report_tr_left'>{dataset[group][subGroup].name}</td>
                      <td className='report_tr_right' style={{ color: this.getStatusColor(this.getGroupStatus(subGroup))}}>{this.getGroupStatus(subGroup)}</td>
                    </tr>
                    })
                 }
            </tbody>
            </table>
          </>)})}
  
          <h1 className="bigTitle"> Score Breakdown</h1>
  
          {Object.keys(dataset).map(group => {
          return (
            <>
            <h1 className="title">{dataset[group].name}</h1>
           {Object.keys(dataset[group]).map(subGroup => {
             if(!parentState.ccpmReport[subGroup].questions || subGroup === 'code' || subGroup === 'name' || subGroup === 'comments') return '';
             return <>
             <p className="subtitle">{dataset[group][subGroup]['name']}</p>
          <table style={{width: '100%', borderCollapse: 'collapse'}}>
              <tbody>
                 {
                    parentState.ccpmReport[subGroup].questions.map((question,index) => {
                      return <>
                      <tr key={question.row.label[0]}>
                       <td className='report_tr_left'>{question.row.label[0]}</td>
                       <td className='report_tr_right' style={{ color: this.getStatusColor(question.averageLabel)}}>{question.averageLabel}</td>
                    </tr>
                    <tr style={{width: '100%', paddingLeft: '40px'}}>
                     {(dataset[group][subGroup].notes && (parentState.ccpmReport[subGroup].questions.length -1 === index)) && dataset[group][subGroup].notes.map((question, index2) => {
                       return <>
                       {index2 === 0 && <h2 className="comment-title">{dataset[group][subGroup].noteName}</h2>}
                       {this.renderComment(question.code, question.name)}
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
         </>)})}
  
           {
             Object.keys(dataset).map(element => {
              if(element !== 'code' && element !== 'name'){
                return <>
                <h1 className="title" style={{marginLeft: '10px'}}> {dataset[element].name}</h1>
                <canvas ref={`canvas${element}`} id={`${element}canv`} />
                {this.renderComment(dataset[element].comments[0], 'Comments on Suggested Improvements')}
                {this.renderComment(dataset[element].comments[1], 'Comments on Success Stories')}
                </>
              }
           })
          }
        </div>
      );
    }
  };