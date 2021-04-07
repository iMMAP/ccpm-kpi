import React from 'react';
import _ from 'underscore';
import {TextRun, Paragraph, ImageRun, SectionType, HorizontalPositionAlign, Table, TableRow, TableCell, WidthType, ShadingType} from 'docx';

const ReportTable = (props) => {

  let data  = [];
  let headers = [];
  let th =[];
  let rows = [];

  const formatNumber = (x) => {
    if (isNaN(x))
      return x;
    return x.toFixed(2);
  }

  if (props.type === 'numerical') {
    headers = [t('Mean'), t('Median'), t('Mode'), t('Standard deviation')];
    if (props.rows)
      headers.unshift('');
    if (props.values){
      var v = props.values;
      headers = [formatNumber(v.mean) || t('N/A'),formatNumber(v.median) || t('N/A'),formatNumber(v.mode) || t('N/A'),
                 formatNumber(v.stdev) || t('N/A')];
    }
    if(props.rows){
      props.rows.map((r)=>{
        return [r[0],formatNumber(r[1].mean) || t('N/A'),formatNumber(r[1].median) || t('N/A'),formatNumber(r[1].mode) || t('N/A'),
                formatNumber(r[1].stdev) || t('N/A')]
      })
    }

    return new Table({
      rows: data.map(t=>new TableRow({
        children: t.map(tt => new TableCell({
          children: [new Paragraph(tt)],
        }))
      }))
    })
  }
  if (props.type === 'regular') {
    th = [t('Value'), t('Frequency'), t('Percentage')];
    rows = props.rows;
  } else {
    // prepare table data for disaggregated rows
    if (props.rows.length > 0) {
      let rowsB = props.rows;
      if (props.responseLabels) {
        th = th.concat(props.responseLabels);
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

  headers = th;
  data = rows;

  const columWidth = new Array(headers.length);
  
  return new Table({
    columnWidths:columWidth.map(w => 9000/columWidth.length),
    margins:{
      top: 10,
      bottom: 150,
    },
    borders: false,
    rows: [new TableRow({
      height: 40,
      children: headers.map(tt => new TableCell({
        shading: {
          fill: "#bcbdbd",
          color: "#bcbdbd",
          val: ShadingType.SOLID,
        },
        children: [new Paragraph(`${tt}`)],
      }))
    }),...data.map(t=>new TableRow({
      children: t.map(tt => new TableCell({
        children: [new Paragraph(`${tt}`)],
      }))
    }))]
  })
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
    return reportTable;
  }

    let p = props,
      d = p.data,
      r = p.row,
      _type = r.type,
      name = p.name;

    if (!_type) {
      return <p className='error'>{'Error displaying row: '}<code>{p.kuid}</code></p>;
    }
    if (_type.select_one || _type.select_multiple) {
      _type = _.keys(_type)[0];
    }
    _type = JSON.stringify(_type);

    let image = '';
    const canv = window.document.getElementById(p.id);
    if(canv){
      image = canv.toDataURL();
    } 


    const element =  {
        properties: {
          type: SectionType.CONTINUOUS,
        },
        children: [
          new Paragraph({
            spacing: {
              before: 0,
              after: 50
            },
            border: {
              top: {
                color: '#797980',
                size: 2,
                space: 10,
                value: 'single'
              },

            },
            children: [new TextRun({
              text: p.label,
              color: '#FF0000',
              size: 24,
              bold:true,
              style: {
                size: 24,
                color: '#FF0000',
                bold: true
              }
            })
          ]
            
          }),
          new Paragraph({
            spacing: {
              before: 100,
              after: 400,
            },
            border: {
              bottom: {
                color: '#797980',
                size: 6,
                space: 10,
                value: 'single'
              }
            },
            children: [
            new TextRun({
              text: t('Type: ') + _type + t('. ') + t('#1 out of #2 respondents answered this question. ').replace('#1', d.provided).replace('#2', d.total_count) + t('(# were without data.)').replace('#', d.not_provided),
              size: 20,
              color: '#797980',
              style: {
                size: 20,
                color: '#797980',
              }
            }),
          ]
            
          })
        ]
      }

      if(image) element.children.push(new Paragraph({
        spacing: {
          before: 100,
          after: 200,
        },
        children: [new ImageRun({
        data:  Uint8Array.from(atob(image.replace('data:image/png;base64,', '')),c=>c.charCodeAt(0)),
        transformation: {
          width: 600,
          height: 250
        },
      })]}))

      const table  =  prepareTable(props.data);
      let reportElement = null;
      if(table){
        if(table && ! d.values) reportElement = ReportTable({rows:table, type:'regular'})
      }
      if(d.values && d.values[0] && d.values[0][1] && d.values[0][1].percentages) reportElement = ReportTable({rows:d.values, type: 'disaggregated'})
      if(d.values && d.values[0] && d.values[0][1] && d.values[0][1].mean) reportElement = ReportTable({rows:d.values, type: 'numerical'})
      if(d.mean) reportElement = ReportTable({values:d, type: 'numerical'})

      element.children.push(reportElement);

      return element;
};

export default ReportViewItem;
