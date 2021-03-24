import React from 'react';
import autoBind from 'react-autobind';
import ReactDOM from 'react-dom';
import _ from 'underscore';
import Chart from 'chart.js';
import {bem} from '../bem';
import {Document, Text, Image, render } from 'redocx';
import DocItem from './docxItem';

export default class Report extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props.reportData);
  }

  render () {
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

    var reportData = this.props.reportData;

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
    console.log('report data', reportData);
    return (
      <Document>
        {
          reportData.map((rowContent, i)=>{
            let label = t('Unlabeled');
            if (_.isArray(rowContent.row.label)) {
              label = rowContent.row.label[tnslIndex];
            } else if (_.isString(rowContent.row.label)) {
              label = rowContent.row.label;
            }

            if (!rowContent.data.provided)
              return false;

            return (
                
                  <DocItem
                      {...rowContent}
                      label={label}
                      triggerQuestionSettings={this.props.triggerQuestionSettings} />
              );
          })
        }
      </Document>
    );
  }
  
}