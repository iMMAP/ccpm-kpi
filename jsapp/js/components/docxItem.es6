import React from 'react';
import autoBind from 'react-autobind';
import ReactDOM from 'react-dom';
import _ from 'underscore';
import {bem} from '../bem';
import {Document, Text, Image, render, Table } from 'redocx';

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
/*
    let th = [''], rows = [];
    if (this.props.type === 'numerical') {
      th = [t('Mean'), t('Median'), t('Mode'), t('Standard deviation')];


      if (this.props.rows)
        th.unshift('');
      if (this.props.values)
        var v = this.props.values
      
      headers = th.map(value => ({
        value,
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
      value
    }));

    rows.forEach(v=>{
      data.push(v.toString());
    });
    */
    return (
      <Table headers={headers} data={[]}/>
    )
  }
};

class ReportViewItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reportTable: false
    };
    this.itemChart = false;
    autoBind(this);
  }
  componentDidMount () {
    this.prepareTable(this.props.data);
  }
  componentWillReceiveProps(nextProps) {
    this.prepareTable(nextProps.data);
  }

  prepareTable(d) {
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
  truncateLabel(label, length = 25) {
    return label.length > length ? label.substring(0,length - 3) + '...' : label;
  }

  render () {
    let p = this.props,
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
    return (
      
      <>
      <Text>{p.label}</Text>
      <Text>{t('Type: ') + _type + t('. ')}</Text>
      <Text>{t('#1 out of #2 respondents answered this question. ').replace('#1', d.provided).replace('#2', d.total_count)}</Text>
      <Text>{t('(# were without data.)').replace('#', d.not_provided)}</Text>
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
      );
  }
};

export default ReportViewItem;
