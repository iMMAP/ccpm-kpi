import React from 'react';
import autoBind from 'react-autobind';
import ReactDOM from 'react-dom';
import _ from 'underscore';
import {bem} from '../bem';
import {Document, Text, Image, render, Table, Hr } from 'redocx';
import glamorous from 'glamorous-redocx';
import {TextRun, Paragraph} from 'docx';

class ReportTable extends React.Component {
  constructor(props) {
    super(props);
  }
  formatNumber(x) {
    if (isNaN(x))
      return x;
    return x.toFixed(2);
  }
  render () {

    let headers = [];
    let data = [];

    console.log(this.props.type);

    let th = [''], rows = [];
    if (this.props.type === 'numerical') {
      th = [t('Mean'), t('Median'), t('Mode'), t('Standard deviation')];


      if (this.props.rows)
        th.unshift('');
      if (this.props.values)
        var v = this.props.values
      
      headers = th.map(value => ({
        value,
        styles: {
          color: 'white',
          fill: 'red',
          size: 15
        }
      }))

      if(this.props.values) {
        data.push([(this.formatNumber(v.mean) || t('N/A')), (this.formatNumber(v.median) || t('N/A')), 
        (this.formatNumber(v.mode) || t('N/A')), (this.formatNumber(v.stdev) || t('N/A'))
      ])
      }

      if(this.props.rows){
        this.props.rows.forEach(r => {
          data.push([r[0],(this.formatNumber(r[1].mean) || t('N/A')), (this.formatNumber(r[1].median) || t('N/A')), 
          (this.formatNumber(r[1].mode) || t('N/A')), (this.formatNumber(r[1].stdev) || t('N/A'))])
        })
      }
    }

    if(this.props.type === 'regular'){
      th = [t('Value'), t('Frequency'), t('Percentage')];
      console.log(this.props.rows)
      rows = this.props.rows;
    } else {
      if (this.props.rows.length > 0) {
        let rowsB = this.props.rows;
        if (this.props.responseLabels) {
          th = th.concat(this.props.responseLabels);
        } else {
          if (rowsB[0] && rowsB[0][1] && rowsB[0][1].responses)
            th = th.concat(rowsB[0][1].responses);
        }
        rowsB.map((row, i)=> {
          var rowitem = row[2] ? [row[2]] : [row[0]];
          rowitem = rowitem.concat(row[1].percentages);
          rows.push(rowitem);
        });
      }
    }
    if (rows.length === 0) {
      return false;
    }

    headers = th.map(value => ({
      value,
      styles: {
        color: '#ffffff',
        size: 15,
        fill: 'green'
      }
    }));
    console.log(rows);
    rows.forEach(v=>{
      data.push(v);
    });

    console.log(data);

    const Table  = glamorous.Table({
      tableColor: 'green',
    })

    return (
      <Table  headers={headers} data={data}/>
    )
  }
};

const ReportViewItem = (props) => {

  const prepareTable = (d) => {
    var reportTable = [];
    if (d.percentages && d.responses && d.frequencies) {
      reportTable = _.zip(
          d.responseLabels || d.responses,
          d.frequencies,
          d.percentages,
        );
    }

    if (d.mean)
      reportTable = false;

    this.setState({reportTable: reportTable});
  }
  const truncateLabel = (label, length = 25) => {
    return label.length > length ? label.substring(0,length - 3) + '...' : label;
  }

    let p = props,
      d = p.data,
      r = p.row,
      _type = r.type,
      name = p.name;

    if (!_type) {
      console.error('No type given for row: ', p);
      return <p className='error'>{'Error displaying row: '}<code>{p.kuid}</code></p>;
    }
    if (_type.select_one || _type.select_multiple) {
      _type = _.keys(_type)[0];
    }
    _type = JSON.stringify(_type);


    const element =  {
        children: [
          new Paragraph({
            children: [new TextRun({
              text: p.label,
              style: {
                size: 14,
                color: '#FF0000',
                bold: true
              }
            })
          ]
            
          }),
          new Paragraph({
            children: [
            new TextRun({
              text: t('Type: ') + _type + t('. ') + t('#1 out of #2 respondents answered this question. ').replace('#1', d.provided).replace('#2', d.total_count) + t('(# were without data.)').replace('#', d.not_provided),
              style: {
                size: 10,
                color: '#797980',
              }
            }),
          ]
            
          })
        ]
      }

      console.log(element);
      return element;
/*
    return (
      
      <>
      <Text style={{color: "red", fontSize: 12}}>{}</Text>
      <Text style={{color: 'grey', fontSize: 9}}>{t('Type: ') + _type + t('. ')} {t('#1 out of #2 respondents answered this question. ').replace('#1', d.provided).replace('#2', d.total_count)} {t('(# were without data.)').replace('#', d.not_provided)}</Text>
         
         

          {this.state.reportTable && ! d.values &&
            <ReportTable rows={this.state.reportTable} type='regular'/>
          }
          {d.values && d.values[0] && d.values[0][1] && d.values[0][1].percentages &&
            <ReportTable rows={d.values} responseLabels={d.responseLabels} type='disaggregated' />
          }
          {d.values && d.values[0] && d.values[0][1] && d.values[0][1].mean &&
            <ReportTable rows={d.values} type='numerical' />
          }
          {d.mean &&
            <ReportTable values={d} type='numerical'/>
          }
      </>
      );*/
  
};

export default ReportViewItem;
