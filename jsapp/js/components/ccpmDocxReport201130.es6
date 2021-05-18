import {Document, TabStopPosition, TabStopType} from "docx";
import dataset, {ccpm_parseNumber} from '../ccpmDataset';
import {ccpm_getStatusLabel, ccpm_getStatusColor} from '../ccpmReport';
import {TextRun, Paragraph, ImageRun, SectionType, Table, TableRow, TableCell, WidthType, SymbolRun} from 'docx';

const getTable2 = (data, length, border = false, marginBottom = 150, leftMargin = 40, top = 0, size = 100) => {
  if (!data) return;
  const columWidth = new Array(length);
  return new Table({
      columnWidths: columWidth.map(w => 9000/columWidth.length),
      width:{size, type:WidthType.PERCENTAGE},
      margins:{
        top: 150,
        bottom: marginBottom,
        left: leftMargin,
        right: 40,
        marginUnitType: 'dxa'
      },
      borders: border,
      rows: [...data.map(t=>new TableRow({
        children: t.map(tt => new TableCell({
          margins: {top},
          children: [tt],
          columnSpan: 2
        }))
      }))]
    })
}

const getP_IS02Question = (parentState) => {
  const {P_IS02Result} = parentState;
  const no = P_IS02Result.filter(res => res[pathP_IS02] === 'no');
  const yes = P_IS02Result.filter(res => res[pathP_IS02] === 'yes');
  const yesAverage = [];
  const noAverage = [];
  if(yes.length > 0){
  Object.keys(yes[0]).forEach(key => {
      if(key !== pathP_IS02){
          let sum = 0;
          yes.forEach(v => { sum += ccpm_parseNumber(v[key])})
          yesAverage.push({id: key, average: sum / yes.length, averageLabel: ccpm_getStatusLabel(sum / yes.length)})}  
  })}

  if(no.length > 0){
    Object.keys(no[0]).forEach(key => {
      if(key !== pathP_IS02){
          let sum = 0;
          no.forEach(v => { sum += ccpm_parseNumber(v[key])})
          noAverage.push({id: key, average: sum / no.length, averageLabel: ccpm_getStatusLabel(sum / no.length)})}  
  })}

  return {yesAverage, noAverage};

}

const getBigTitle = (title) => {
  return  new Paragraph({
    spacing: {
      before: 150,
      after: 150,
    },
    border: {
      top: {
        color: '#097ca8',
        size: 15,
        space: 10,
        value: 'single'
      },
    },
    children: [new TextRun({
      text: title,
      color: '#000000',
      size: 28,
      bold:true,
      style: {
        size: 28,
        color: '#000000',
        bold: true
      }
    })
  ] 
  })
}

const getTitle = (text) => {
  return new Paragraph({
    spacing: {
      before: 0,
      after: 50,
    },
    children: [new TextRun({
      text,
      color: '#4e4e4e',
      size: 26,
      bold:true,
      style: {
        size: 26,
        color: '#4e4e4e',
        bold: true
      }
    })
  ]
    
  })
}

const getSubTitle = (text) => {
  return new Paragraph({
    spacing: {
      before: 100,
      after: 100,
    },
    
    children: [
      new TextRun({
        text: text,
        size: 22,
        color: '#000000',
        bold: true,
        style: {
          size: 22,
          color: '#000000',
        }
      }), 
  ] 
  })
}

const getTableContent = (text) => {
  return new Paragraph({
    spacing: {
      before: 100,
      after: 100,
    },
    
    children: [
      new TextRun({
        text: text,
        size: 22,
        color: '#4e4e4e',
        bold: false,
        style: {
          size: 22,
          color: '#4e4e4e',
        }
      }), 
  ] 
  })
}

const getNoteTitle = (text) => {
  return new Paragraph({
    spacing: {
      before: 0,
      after: 50,
    },
    children: [new TextRun({
      text,
      color: '#000000',
      size: 21,
      bold:true,
      style: {
        size: 21,
        color: '#000000',
        bold: true
      }
    })
  ]  
  })
}

const renderComment = (questionCode, questionName, parentState) => {
    const data =  parentState.reportData.find(q => q.name === questionCode);
    if(!data) return '';
    if(data.row.type === 'select_one') {
        const rows  = data.data.responses.map((response, index) => {
            return [
              new Paragraph({
              spacing: {
                before: 100,
                after: 400,
              },
              
              children: [
                new TextRun({
                  text: response,
                  size: 19,
                  color: '#000000',
                  style: {
                    size: 19,
                    color: '#000000',
                  }
                }), 
            ] 
            }),
            new Paragraph({
              spacing: {
                before: 100,
                after: 400,
              },
              children: [
                new TextRun({
                  text:`${data.data.percentages[index]} %`,
                  size: 19,
                  color: '#000000',
                  style: {
                    size: 19,
                    color: '#000000',
                  }
                }), 
            ] 
            }),
            ];
        })
        return getTable2(rows, 2, true, 20, 100);
    } 
    if(data.row.type === 'text') {
        const rows  = data.data.responses.map((response) => {
            return [
              new Paragraph({
                spacing: {
                  before: 100,
                  after: 400,
                },
                children: [
                  new TextRun({
                    text: response,
                    size: 20,
                    color: '#808080',
                    style: {
                      size: 20,
                      color: '#808080',
                    }
                  }), 
              ] 
              }),
            ];
        })
        return getTable2(rows, 1, true, 20, 100);
    }
  }

  const getGroupData = (parentState) => {
    const dataToShow = [];
    Object.keys(dataset).forEach(group => {
      dataToShow.push(new Paragraph({
        children: [ new TextRun('')],
      }))

      dataToShow.push(getTitle(dataset[group].name));
      dataToShow.push(new Paragraph({
        children: [ new TextRun('')],
      }))

      const tableData = Object.keys(dataset[group]).filter(sg => sg !== 'code' && sg !== 'name' && sg !== 'comments').map(subGroup => {
        return [
          getTableContent(dataset[group][subGroup].name),
          new Paragraph({
            spacing: {
              before: 100,
              after: 400,
            },
            children: [
              new TextRun({
                text: ccpm_getStatusLabel(parentState.ccpmReport[subGroup].averageInGroup),
                size: 20,
                color: ccpm_getStatusColor(ccpm_getStatusLabel(parentState.ccpmReport[subGroup].averageInGroup)),
                bold: true,
                style: {
                  size: 20,
                  color: ccpm_getStatusColor(ccpm_getStatusLabel(parentState.ccpmReport[subGroup].averageInGroup)),
                }
              }), 
          ] 
          })
        ]    
      });
      const table = getTable2(tableData, 2, true, 20);
      if(table) dataToShow.push(table);
}   );
    const P_IS02Result = getP_IS02Question(parentState);
     dataToShow.push(getBigTitle("Score Breakdown"));
    Object.keys(dataset).forEach(group => {
        dataToShow.push(getTitle(dataset[group].name));
        dataToShow.push(new Paragraph({
          children: [ new TextRun('')],
      }))
        Object.keys(dataset[group]).filter(sg => sg !== 'code' && sg !== 'name' && sg !== 'comments').forEach(subGroup => {
            
          dataToShow.push(getSubTitle(dataset[group][subGroup]['name']));
          dataToShow.push(new Paragraph({
            children: [ new TextRun('')],
        }))
          const tableData = parentState.ccpmReport[subGroup].questions.map((question,index) => {
            if(subGroup === 'analysisTopicCovered') {
              const questionYes = P_IS02Result.yesAverage.find(f => f.id.includes(question.name)) || {}
              const questionNo = P_IS02Result.noAverage.find(f => f.id.includes(question.name)) || {};
            return [
              getTableContent(question.row.label[0]),
              new Paragraph({
                spacing: {
                  before: 100,
                  after: 400,
                },
                children: [
                  new TextRun({
                    text: questionYes.averageLabel,
                    size: 20,
                    color: ccpm_getStatusColor(questionYes.averageLabel),
                    bold: true,
                    style: {
                      size: 20,
                      color: ccpm_getStatusColor(questionYes.averageLabel),
                    }
                  }), 
              ] 
              }),
              new Paragraph({
                spacing: {
                  before: 100,
                  after: 400,
                },
                children: [
                  new TextRun({
                    text: questionNo.averageLabel,
                    size: 20,
                    color: ccpm_getStatusColor(questionNo.averageLabel),
                    bold: true,
                    style: {
                      size: 20,
                      color: ccpm_getStatusColor(questionNo.averageLabel),
                    }
                  }), 
              ] 
              })
            ]}
            return [
              getTableContent(question.row.label[0]),
              new Paragraph({
                spacing: {
                  before: 100,
                  after: 400,
                },
                children: [
                  new TextRun({
                    text: question.averageLabel,
                    size: 20,
                    color: ccpm_getStatusColor(question.averageLabel),
                    bold: true,
                    style: {
                      size: 20,
                      color: ccpm_getStatusColor(question.averageLabel),
                    }
                  }), 
              ] 
              })
            ]    
          })
          if(subGroup === 'analysisTopicCovered') tableData.unshift([
            getSubTitle('TOPIC'),
            getSubTitle('YES'),
            getSubTitle('NO')
          ]);
          const table = getTable2(tableData, subGroup === 'analysisTopicCovered' ? 3 : 2, true);
          if(table) dataToShow.push(table)
          if(dataset[group][subGroup].notes){
            dataset[group][subGroup].notes.forEach((question, index2) =>{
              const commentTable = renderComment(question.code, question.name,parentState);
              if(commentTable){
              dataToShow.push(new Paragraph({
                  children: [ new TextRun('')],
              }))
              dataToShow.push(getNoteTitle(dataset[group][subGroup].noteName));
              dataToShow.push(new Paragraph({
                children: [ new TextRun('')],
            }))
              dataToShow.push(commentTable);
              dataToShow.push(
                new Paragraph({
                  spacing: {
                    before: 150,
                    after: 150,
                  },
                  border: {
                    bottom: {
                      color: '#097ca8',
                      size: 2,
                      space: 10,
                      value: 'single'
                    },
                  },
                  children: [new TextRun(' ')
                ]}) 
              )
              }
            })  
          }  
               
        });
  });
  return dataToShow;
  }

  const getImages = (imageData, data, chartNumber = '') => {
    const table = [];
    data.forEach((v,i) =>
    {
      if(i%2 === 0){
        if(data[i+1]){
        table.push([getSubTitle(`${v.row.label[0]}  (${Math.floor(calculatePercentage(v.questionsDisagregatedByPartner, v.data.mean))}) %`),
        getSubTitle(`${data[i+1].row.label[0]}  (${Math.floor(calculatePercentage(data[i+1].questionsDisagregatedByPartner, data[i+1].data.mean))}) %`)
      ]);
      table.push([new Paragraph({
            spacing: {
              before: 100,
              after: 200,
            },
            children: [new ImageRun({
            data:  Uint8Array.from(atob((document.getElementById(`chart${chartNumber}-${i}`).querySelector('canvas').toDataURL()).replace('data:image/png;base64,', '')),c=>c.charCodeAt(0)),
            transformation: {
              width: 340,
              height: 100
            },
          })]}),
        new Paragraph({
          spacing: {
            before: 100,
            after: 200,
          },
          children: [new ImageRun({
          data:  Uint8Array.from(atob((document.getElementById(`chart${chartNumber}-${i+1}`).querySelector('canvas').toDataURL()).replace('data:image/png;base64,', '')),c=>c.charCodeAt(0)),
          transformation: {
            width: 340,
            height: 100
          },
        })]})
       ])
      } else {
          table.push([
            getSubTitle(`${v.row.label[0]}  (${Math.floor(calculatePercentage(v.questionsDisagregatedByPartner, v.data.mean))}) %`)
        ]);
        table.push([new Paragraph({
            spacing: {
              before: 100,
              after: 200,
            },
            children: [new ImageRun({
                  data: Uint8Array.from(atob((document.getElementById(`chart${chartNumber}-${i}`).querySelector('canvas').toDataURL()).replace('data:image/png;base64,', '')),c=>c.charCodeAt(0)),
                  transformation: {
                    width: 250,
                    height: 80
                  },
                })
            ]})
          ])

        }
      }
    })
    return getTable2(table, 2,'');
  }

  const calculatePercentage = (total, sum) => {
    if(total === 0 || isNaN(total)) total = 1;
    if(isNaN(sum)) sum = 0;
    return (sum / total) * 100;
  }

  const getLastPart = (parentState) => {
      const data = [];
      Object.keys(dataset).forEach(element => {
       if(element !== 'code' && element !== 'name'){
        data.push(getTitle(dataset[element].name));
        let image = '';
        const canv = window.document.getElementById(`${element}canv`);
        if(canv){
          image = canv.toDataURL();
          data.push(new Paragraph({
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
          })]}),)
        }

        data.push(getNoteTitle("Comment on Suggested Improvements"));

        data.push(renderComment(dataset[element].comments[0], 'Comments on Suggested Improvements', parentState));

        data.push(getNoteTitle("Comments on Success Stories"));
        data.push(renderComment(dataset[element].comments[1], 'Comments on Success Stories', parentState))
       }
    })
    return data;
  }

export default class CCPM_ReportContents {
    create(parentState){

      const {totalReponses: {numberOfPartner}} = parentState;
    
        return new Promise((resolve)=>{
          const  sections = [
            {
              properties: {
                type: SectionType.CONTINUOUS,
              },
              children: [
                getBigTitle("Overall Response Rate"),
                getTitle('Total Responses'),
                new Paragraph({
                  spacing: {
                    before: 100,
                    after: 200,
                  },
                  children: [new ImageRun({
                  data:  Uint8Array.from(atob((document.getElementById('totalResponseChart').querySelector('canvas').toDataURL()).replace('data:image/png;base64,', '')),c=>c.charCodeAt(0)),
                  transformation: {
                    width: 450,
                    height: 100
                  },
                })]}),
                getTable2([
                  [getSubTitle('Total'), getTableContent(`${calculatePercentage(numberOfPartner, parentState.totalReponses.sum)}`)],
                  [getSubTitle('Number Partners Responding'), getTableContent(`${numberOfPartner}`)],
                  [getSubTitle('Total Number of Partners'), getTableContent(`${parentState.totalReponses.sum}`)],
                ], 2, true),
                new Paragraph(" "),
                getTitle('Responses by Type'),
                new Paragraph(" "),
                getImages({}, parentState.totalResponseDisagregatedByPartner, ''),
                getBigTitle("Effective Response Rate"),
                getTitle('Total Responses'),
                new Paragraph({
                  spacing: {
                    before: 100,
                    after: 200,
                  },
                  children: [new ImageRun({
                  data:  Uint8Array.from(atob((document.getElementById('totalEffectiveResponseChart').querySelector('canvas').toDataURL()).replace('data:image/png;base64,', '')),c=>c.charCodeAt(0)),
                  transformation: {
                    width: 450,
                    height: 100
                  },
                })]}),
                getTable2([
                  [getSubTitle('Total'), getTableContent(`${calculatePercentage(numberOfPartner, parentState.totalEffectiveResponse.sum)}`)],
                  [getSubTitle('Number Partners Responding'), getTableContent(`${numberOfPartner}`)],
                  [getSubTitle('Total Number of Partners'), getTableContent(`${parentState.totalEffectiveResponse.sum}`)],
                ], 2, true),
                new Paragraph(" "),
                getTitle('Responses by Type'),
                new Paragraph(" "),
                getImages({}, parentState.totalEffectiveResponseDisagregatedByPartner, '2'),
                ...getGroupData(parentState),
                ...getLastPart(parentState)
          
              ]
            }
        ];
          resolve(new Document({
            sections: sections
          }))
        })
      
      
  }
};
