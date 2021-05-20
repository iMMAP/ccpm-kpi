import {AlignmentType, BorderStyle, Document, TabStopPosition, TabStopType} from "docx";
import dataset, {ccpm_parseNumber, titleConstants, ccpm_getQuestionInRange, ccpm_getAverageInBoolQuestion} from '../ccpmDataset';
import {ccpm_getStatusLabel, ccpm_getStatusColor, ccpm_getLabel, ccpm_getName} from '../ccpmReport';
import {TextRun, Paragraph, ImageRun, SectionType, Table, TableRow, TableCell, WidthType, SymbolRun} from 'docx';
import { ccpm_getStatusLabelBoolean } from "../ccpmReport.es6";

const getTable2 = (data, length, border = false, marginBottom = 150, leftMargin = 40, top = 0, size = 100, comment = false) => {
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
      borders: border ? {
        bottom: {color: 'grey', size: 1, style: BorderStyle.SINGLE},
        top: {color: 'grey', size: 1, style: BorderStyle.SINGLE},
        left: {color: '#808080', size: 1, style: BorderStyle.SINGLE},
        right: {color: '#808080', size: 1, style: BorderStyle.SINGLE},
      }: false,
      rows: [...data.map(t=>new TableRow({
        children: t.map((tt, ind) => new TableCell({
          margins: {top},
          children: [tt],
          columnSpan: 2,
          width: length ===  2 ? !comment ?  ind === 1 ? {
            size: '30%',
            type: WidthType.PERCENTAGE,
          } : {size: '70%', type: WidthType.PERCENTAGE} : ind === 0 ? {size: '30%', type: WidthType.PERCENTAGE} : {size: '70%', type: WidthType.PERCENTAGE} :
          {
            size: `${100/length}%`,
            type: WidthType.PERCENTAGE
          }
        }))
      }))]
    })
}

const getP_IS02Question = (parentState) => {
  const {P_IS02Result, pathP_IS02,pathP_IS03} = parentState;
  const no = P_IS02Result.filter(res => res[pathP_IS02] === 'no');
  const yes = P_IS02Result.filter(res => res[pathP_IS02] === 'yes');
  const yesAverage = [];
  const noAverage = [];
  const keys = ccpm_getQuestionInRange('informingStrategicDecisions','analysisTopicCovered').map(s => `${pathP_IS03}${s}`)
  if(yes.length > 0){
    keys.forEach(key => {
      if(key !== pathP_IS02){
          let sum = 0;
          let count = 0;
          yes.forEach(v => {
            if(v[key] > 0){
             sum += ccpm_parseNumber(v[key]);
             count++;
            }
          })
          yesAverage.push({id: key, average: sum / (count > 0 ? count : 1), averageLabel: ccpm_getStatusLabel(sum / (count > 0 ? count : 1))})}  
  })}

  if(no.length > 0){
    keys.forEach(key => {
      if(key !== pathP_IS02){
          let sum = 0;
          let count = 0;
          no.forEach(v => { 
            if(v[key] > 0){
              sum += ccpm_parseNumber(v[key]);
              count++;
             }
          })
          noAverage.push({id: key, average: sum / (count > 0 ? count : 1), averageLabel: ccpm_getStatusLabel(sum / (count > 0 ? count : 1))})} 
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
        size: 25,
        space: 10,
        value: 'single'
      },
    },
    children: [new TextRun({
      text: title,
      color: '#000000',
      size: 32,
      bold:true,
      style: {
        size: 32,
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
      size: 28,
      bold:true,
      style: {
        size: 28,
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
    tabStops: [
      {
          type: TabStopType.LEFT,
          position: 1000,
      },
   ],
    children: [new TextRun({
      text,
      color: '#000000',
      size: 21,
      bold:true,
      underline: {
        color: '#097ca8',
      },
      style: {
        size: 21,
        color: '#000000',
        bold: true
      }
    })
  ]  
  })
}

const getNoteSubTitle = (text) => {
  return new Paragraph({
    spacing: {
      before: 0,
      after: 50,
    },
    children: [new TextRun({
      text,
      color: '#000000',
      size: 19,
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
      let rows = [];
      if(data.data.responseLabels){
          rows  = data.data.responseLabels.map((response) => {
            return [new Paragraph(''),
              new Paragraph({
                spacing: {
                  before: 100,
                  after: 100,
                },
                alignment: AlignmentType.LEFT,
                border: {
                  top: {size: 1, color: 'grey'},
                  bottom: {size: 1, color: 'grey'},
                  left: {size: 1, color: 'grey'},
                  right: {size: 1, color: 'grey'}
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
        })} else {
          rows  = data.data.responses.map((response) => {
            return [new Paragraph(''),
              new Paragraph({
                spacing: {
                  before: 100,
                  after: 100,
                },
                alignment: AlignmentType.LEFT,
                border: {
                  top: {size: 1, color: 'grey'},
                  bottom: {size: 1, color: 'grey'},
                  left: {size: 1, color: 'grey'},
                  right: {size: 1, color: 'grey'}
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
      }
        return getTable2(rows, 1, false, 20, 100,undefined,undefined, true);
  }

  const getGroupData = (parentState, choosenLanguage, languageIndex) => {
    const dataToShow = [];
    Object.keys(dataset).forEach(group => {
      dataToShow.push(new Paragraph({
        children: [ new TextRun('')],
      }))
      dataToShow.push(getTitle(ccpm_getName(dataset[group], choosenLanguage)));
      dataToShow.push(new Paragraph({
        children: [ new TextRun('')],
      }))

      const tableData = Object.keys(dataset[group]).filter(sg => sg !== 'code' && sg !== 'names' && sg !== 'name' && sg !== 'comments').map(subGroup => {
        return [
          getTableContent(ccpm_getName(dataset[group][subGroup], choosenLanguage)),
          new Paragraph({
            spacing: {
              before: 100,
              after: 100,
            },
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: dataset[group][subGroup].starting ?  ccpm_getStatusLabel(parentState.ccpmReport[subGroup].averageInGroup, choosenLanguage) : ccpm_getStatusLabelBoolean(parentState.ccpmReport[subGroup].averageInGroup, choosenLanguage),
                size: 20,
                color: ccpm_getStatusColor(dataset[group][subGroup].starting ?  ccpm_getStatusLabel(parentState.ccpmReport[subGroup].averageInGroup) : ccpm_getStatusLabelBoolean(parentState.ccpmReport[subGroup].averageInGroup)),
                bold: true,
                
                style: {
                  size: 20,
                  color: ccpm_getStatusColor(dataset[group][subGroup].starting ?  ccpm_getStatusLabel(parentState.ccpmReport[subGroup].averageInGroup) : ccpm_getStatusLabelBoolean(parentState.ccpmReport[subGroup].averageInGroup)),
                }
              }), 
          ] 
          })
        ]    
      });
      const table = getTable2(tableData, 2, true, 20);
      if(table) dataToShow.push(table);
}   );
    
  return dataToShow;
  }

  const scoreBreakDownGroup =  (parentState, choosenLanguage, languageIndex) => {
    const dataToShow = [];
    const P_IS02Result = getP_IS02Question(parentState);
    dataToShow.push(getBigTitle(titleConstants.scoreBreakdown[choosenLanguage]));
    dataToShow.push(new Paragraph({
      children: [ new TextRun('')],
  }))
   Object.keys(dataset).forEach(group => {
       dataToShow.push(getTitle(ccpm_getName(dataset[group], choosenLanguage)));
       dataToShow.push(new Paragraph({
         children: [ new TextRun('')],
     }))
       Object.keys(dataset[group]).filter(sg => sg !== 'code' && sg !== 'names' && sg !== 'name' && sg !== 'comments').forEach(subGroup => {
         dataToShow.push(getSubTitle(ccpm_getName(dataset[group][subGroup], choosenLanguage)));
         dataToShow.push(new Paragraph({
           children: [ new TextRun('')],
       }))
         const tableData = parentState.ccpmReport[subGroup].questions.map((question,index) => {
           if(subGroup === 'analysisTopicCovered') {
             const questionYes = P_IS02Result.yesAverage.find(f => f.id.includes(question.name)) || {}
             const questionNo = P_IS02Result.noAverage.find(f => f.id.includes(question.name)) || {};
           return [
             getTableContent(ccpm_getLabel(languageIndex,question.row.label)),
             new Paragraph({
               spacing: {
                 before: 100,
                 after: 100,
               },
               alignment: AlignmentType.CENTER,
               children: [
                 new TextRun({
                   text: ccpm_getStatusLabel(questionYes.average, choosenLanguage),
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
                 after: 100,
               },
               alignment: AlignmentType.CENTER,
               children: [
                 new TextRun({
                   text: ccpm_getStatusLabel(questionNo.average, choosenLanguage),
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
             getTableContent(ccpm_getLabel(languageIndex,question.row.label)),
             new Paragraph({
               spacing: {
                 before: 100,
                 after: 100,
               },
               alignment: AlignmentType.CENTER,
               children: [
                 new TextRun({
                   text: ccpm_getStatusLabel(question.average, choosenLanguage),
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
           getSubTitle(titleConstants.topic[choosenLanguage]),
           getSubTitle(titleConstants.haveDoneSituationAnalysis[choosenLanguage]),
           getSubTitle(titleConstants.haveNotDoneSituationAnalysis[choosenLanguage])
         ]);
         const table = getTable2(tableData, subGroup === 'analysisTopicCovered' ? 3 : 2, true);
         if(table) dataToShow.push(table)
         if(dataset[group][subGroup].notes){
           dataset[group][subGroup].notes.forEach((question, index2) =>{
             const commentTable = renderComment(question.code, ccpm_getLabel(languageIndex, (parentState.reportData.find(q => q.name === question.code)).row.label),parentState);
             if(commentTable){
              if(index2 === 0){
             dataToShow.push(new Paragraph({
                 children: [ new TextRun('')],
             }))
             const notTitle = [[new Paragraph(''), getNoteTitle(dataset[group][subGroup].noteName[choosenLanguage])]];
             dataToShow.push(getTable2(notTitle, 2, false, undefined, undefined, undefined, undefined, true));
             }
            dataToShow.push(new Paragraph({
              children: [ new TextRun('')],
            }))
            const subNoteTitle= [[new Paragraph(''), getNoteSubTitle(ccpm_getLabel(languageIndex, (parentState.reportData.find(q => q.name === question.code)).row.label))]]
            dataToShow.push(getTable2(subNoteTitle, 2, false, undefined, undefined, undefined, undefined, true));
            dataToShow.push(new Paragraph({
              children: [ new TextRun('')],
              }))

           
             dataToShow.push(commentTable);
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
    if(isNaN(total)) total = 0;
    if(isNaN(sum)) sum = 1;
    return (total / sum) * 100;
  }

  const getLastPart = (parentState, choosenLanguage) => {
      const data = [];
      Object.keys(dataset).forEach(element => {
       if(element !== 'code' && element !== 'name'){
        data.push(getTitle(ccpm_getName(dataset[element].name, choosenLanguage)));
        let image = '';
        const canv = window.document.getElementById(`${element}canv`);
        if(canv){
          image = canv.toDataURL();
          data.push(new Paragraph({
            spacing: {
              before: 100,
              after: 100,
            },
            children: [new ImageRun({
            data:  Uint8Array.from(atob(image.replace('data:image/png;base64,', '')),c=>c.charCodeAt(0)),
            transformation: {
              width: 600,
              height: 250
            },
          })]}),)
        }

        data.push(getNoteTitle(titleConstants.commentSuggestedImprovment[choosenLanguage]));

        data.push(renderComment(dataset[element].comments[0], titleConstants.commentSuggestedImprovment[choosenLanguage], parentState));

        data.push(getNoteTitle(titleConstants.commentSuccessStories[choosenLanguage]));
        data.push(renderComment(dataset[element].comments[1], titleConstants.commentSuccessStories[choosenLanguage], parentState))
       }
    })
    return data;
  }

export default class CCPM_ReportContents {
    create(parentState){
      const {totalReponses: {numberOfPartner}, reportStyles, asset: {content: {translations}}} = parentState;
      const currentLanguageIndex = reportStyles.default.translationIndex;
      const choosenLanguage = translations ?  ((translations[currentLanguageIndex]).match(/\(.*?\)/))[0].replace('(', '').replace(')', '') : 'en';
      
    
        return new Promise((resolve)=>{
          const  sections = [
            {
              properties: {
                type: SectionType.NEXT_PAGE,
              },
              children: [
                getBigTitle(titleConstants.overallResponseRate[choosenLanguage]),
                getTitle(titleConstants.totalResponse[choosenLanguage]),
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
                  [getSubTitle(titleConstants.numberPartnerResponding[choosenLanguage]), getTableContent(`${numberOfPartner}`)],
                  [getSubTitle(titleConstants.totalNumberOfPartner[choosenLanguage]), getTableContent(`${parentState.totalReponses.sum}`)],
                ], 2, true, undefined, undefined, undefined, 70),
                new Paragraph(" "),
                getTitle(titleConstants.responseByType[choosenLanguage]),
                new Paragraph(" "),
                getImages({}, parentState.totalResponseDisagregatedByPartner, ''),]},
              {
                properties: {
                  type: SectionType.NEXT_PAGE,
                },
                children: [
                getBigTitle(titleConstants.effectiveResponseRate[choosenLanguage]),
                getTitle(titleConstants.totalResponse[choosenLanguage]),
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
                  [getSubTitle(titleConstants.numberPartnerResponding[choosenLanguage]), getTableContent(`${numberOfPartner}`)],
                  [getSubTitle(titleConstants.totalNumberOfPartner[choosenLanguage]), getTableContent(`${parentState.totalEffectiveResponse.sum}`)],
                ], 2, true, undefined, undefined, undefined, 70),
                new Paragraph(" "),
                getTitle(titleConstants.responseByType[choosenLanguage]),
                new Paragraph(" "),
                getImages({}, parentState.totalEffectiveResponseDisagregatedByPartner, '2'),
              ]},{
                properties: {
                  type: SectionType.NEXT_PAGE,
                },
                children: [
                getBigTitle(titleConstants.overallPerformance[choosenLanguage]),
                ...getGroupData(parentState, choosenLanguage, currentLanguageIndex),
                ]},
                {
                  properties: {
                    type: SectionType.NEXT_PAGE,
                  },
                  children: [
                  ...scoreBreakDownGroup(parentState, choosenLanguage, currentLanguageIndex),
                  ]
                },
                {
                  properties: {
                    type: SectionType.NEXT_PAGE,
                  },
                  children:  getLastPart(parentState, choosenLanguage)
                }   
        ];
          resolve(new Document({
            sections: sections
          }))
        })
      
      
  }
};
