import {Document} from "docx";
import dataset from '../ccpm_dataset';
import {ccpm_getStatusLabel, ccpm_getStatusColor} from '../ccpm_report';
import {toCanvas, toPng} from 'html-to-image';
import {TextRun, Paragraph, ImageRun, SectionType, Table, TableRow, TableCell, WidthType} from 'docx';

const getTable2 = (data, length, border = false, marginBottom = 150) => {
  if (!data) return;
  const columWidth = new Array(length);
  return new Table({
      columnWidths: columWidth.map(w => 9000/columWidth.length),
      width:{size: 100, type:WidthType.PERCENTAGE},
      margins:{
        top: 10,
        bottom: marginBottom,
        left: 40,
        right: 40
      },
      borders: border,
      rows: [...data.map(t=>new TableRow({
        children: t.map(tt => new TableCell({
          children: [tt],
          columnSpan: 2
        }))
      }))]
    })
}

const renderComment = (questionCode, questionName, parentState) => {
    const data =  parentState.reportData.find(q => q.name === questionCode);
    if(!data) return '';
    if(data.row.type === 'select_one') {
        const rows  = data.data.responses.map((response, index) => {
            return [new Paragraph({
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
            new Paragraph({
              spacing: {
                before: 100,
                after: 400,
              },
              children: [
                new TextRun({
                  text:`${data.data.percentages[index]} %`,
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
        return getTable2(rows, 2, questionName, 20);
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
        return getTable2(rows, 1, questionName, 20);
    }
  }

  const getGroupData = (parentState) => {
    const dataToShow = [];
    Object.keys(dataset).forEach(group => {

      dataToShow.push(new Paragraph({
          spacing: {
            before: 0,
            after: 50,
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
            text: dataset[group].name,
            color: '#000000',
            size: 24,
            bold:true,
            style: {
              size: 24,
              color: '#000000',
              bold: true
            }
          })
        ]
          
        }));

      const tableData = Object.keys(dataset[group]).filter(sg => sg !== 'code' && sg !== 'name' && sg !== 'comments').map(subGroup => {
        return [
          new Paragraph({
            spacing: {
              before: 100,
              after: 400,
            },
            children: [
              new TextRun({
                text: dataset[group][subGroup].name,
                size: 20,
                color: '#808080',
                style: {
                  size: 20,
                  color: '#808080',
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
     dataToShow.push(new Paragraph({
        spacing: {
          before: 0,
          after: 50,
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
          text: 'Score Breakdown',
          color: '#000000',
          size: 24,
          bold:true,
          style: {
            size: 24,
            color: '#000000',
            bold: true
          }
        })
      ]
        
      }));
    Object.keys(dataset).forEach(group => {

        dataToShow.push(new Paragraph({
            spacing: {
              before: 0,
              after: 50,
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
              text: dataset[group].name,
              color: '#000000',
              size: 24,
              bold:true,
              style: {
                size: 24,
                color: '#000000',
                bold: true
              }
            })
          ]
            
          }));
        Object.keys(dataset[group]).filter(sg => sg !== 'code' && sg !== 'name' && sg !== 'comments').forEach(subGroup => {
            
          dataToShow.push(new Paragraph({
            spacing: {
              before: 0,
              after: 50,
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
              text: dataset[group][subGroup]['name'],
              color: '#000000',
              size: 24,
              bold:true,
              style: {
                size: 24,
                color: '#000000',
                bold: true
              }
            })
          ]
            
          }));
              const tableData = parentState.ccpmReport[subGroup].questions.map((question,index) => {
                return [
                  new Paragraph({
                    spacing: {
                      before: 100,
                      after: 400,
                    },
                    children: [
                      new TextRun({
                        text: question.row.label[0],
                        size: 20,
                        color: '#808080',
                        bold: true,
                        style: {
                          size: 20,
                          color: '#808080',
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
              const table = getTable2(tableData, 2, true, 20);
              if(table) dataToShow.push(table)
              if(dataset[group][subGroup].notes && (parentState.ccpmReport[subGroup].questions.length -1 === index)){
                dataset[group][subGroup].notes.forEach((question, index2) =>{
                  dataToShow.push(new Paragraph({
                    spacing: {
                      before: 0,
                      after: 50,
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
                      text: dataset[group][subGroup].noteName,
                      color: '#000000',
                      size: 24,
                      bold:true,
                      style: {
                        size: 24,
                        color: '#000000',
                        bold: true
                      }
                    })
                  ]  
                  }));
                  const commentTable = renderComment(question.code, question.name);
                  if(commentTable)dataToShow.push(commentTable);
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
        table.push([new Paragraph({
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
              text: `${v.row.label[0]} (${Math.floor((v.data.mean || 0 /v.questionsDisagregatedByPartner || 1) * 100)}) %` ,
              size: 20,
              bold: true,
              color: '#797980',
              style: {
                size: 20,
                color: '#797980',
              }
            }), 
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
              text: `${data[i+1].row.label[0]} (${Math.floor((data[i+1].data.mean || 0 /data[i+1].questionsDisagregatedByPartner || 1) * 100)}) %` ,
              size: 20,
              color: '#797980',
              bold: true,
              style: {
                size: 20,
                color: '#797980',
              }
            }), 
        ] 
        })
      ]);
      table.push([new Paragraph({
            spacing: {
              before: 100,
              after: 200,
            },
            children: [new ImageRun({
            data:  Uint8Array.from(atob((imageData.find(img => img.id === `idchart${chartNumber}-${i}svg`)).image.replace('data:image/png;base64,', '')),c=>c.charCodeAt(0)),
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
          data:  Uint8Array.from(atob((imageData.find(img => img.id === `idchart${chartNumber}-${i+1}svg`)).image.replace('data:image/png;base64,', '')),c=>c.charCodeAt(0)),
          transformation: {
            width: 340,
            height: 100
          },
        })]})
       ])
      } else {
          table.push([new Paragraph({
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
                text: `${v.row.label[0]} (${Math.floor((v.data.mean || 0 /v.questionsDisagregatedByPartner || 1) * 100)}) %` ,
                size: 20,
                color: '#797980',
                style: {
                  size: 20,
                  color: '#797980',
                }
              }), 
          ] 
          }),
        ]);
        table.push([new Paragraph({
            spacing: {
              before: 100,
              after: 200,
            },
            children: [new ImageRun({
                  data:  Uint8Array.from(atob((imageData.find(img => img.id === `idchart${chartNumber}-${i}svg`)).image.replace('data:image/png;base64,', '')),c=>c.charCodeAt(0)),
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

  const getLastPart = (parentState) => {
      const data = [];
      Object.keys(dataset).forEach(element => {
       if(element !== 'code' && element !== 'name'){
        data.push(new Paragraph({
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
              text: dataset[element].name,
              size: 22,
              color: '#797980',
              style: {
                size: 22,
                color: '#797980',
              }
            }), 
        ]
          
        }));
        
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

        data.push(new Paragraph({
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
              text: "Comment on Suggested Improvements",
              size: 22,
              color: '#797980',
              style: {
                size: 22,
                color: '#797980',
              }
            }), 
        ]
          
        }));

        data.push(renderComment(dataset[element].comments[0], 'Comments on Suggested Improvements', parentState));

        data.push(new Paragraph({
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
              text: "Comments on Success Stories",
              size: 22,
              color: '#000000',
              style: {
                size: 22,
                color: '#797980',
              }
            }), 
        ]
          
        }));
        data.push(renderComment(dataset[element].comments[1], 'Comments on Success Stories', parentState))
       }
    })
    return data;
  }

export default class CCPM_ReportContents {
    create(parentState){
      const images = document.getElementsByClassName('svgImage');
      const imageData = {};
      for(let i = 0;i<images.length;i++){
        if(!imageData[images.item(i).id]) imageData[images.item(i).id] = images.item(i);
      }

      return Promise.all(Object.keys(imageData).map( (v,i)=>{
        if(imageData[v]){
          return toPng(imageData[v]).then(result => {
            return Promise.resolve({image: result, id: v});
          }).catch(err => {
            return ''
          })
        } 
      })).then(v => {
        return new Promise((resolve)=>{
          const  sections = [
            {
              properties: {
                type: SectionType.CONTINUOUS,
              },
              children: [
                new Paragraph({
                  spacing: {
                    before: 0,
                    after: 50,
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
                    text: 'Overall Response Rate',
                    color: '#000000',
                    size: 24,
                    bold:true,
                    style: {
                      size: 24,
                      color: '#000000',
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
                      text: 'Overall Active Partners Response Rate',
                      size: 20,
                      color: '#797980',
                      style: {
                        size: 20,
                        color: '#797980',
                      }
                    }), 
                ]
                  
                }),
                new Paragraph({
                  spacing: {
                    before: 100,
                    after: 200,
                  },
                  children: [new ImageRun({
                  data:  Uint8Array.from(atob((v.find(img => img.id === 'idtotalResponseChartsvg')).image.replace('data:image/png;base64,', '')),c=>c.charCodeAt(0)),
                  transformation: {
                    width: 450,
                    height: 100
                  },
                })]}),
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
                      text: 'Overall Active Partners Response Rate by type',
                      size: 20,
                      color: '#797980',
                      style: {
                        size: 20,
                        color: '#797980',
                      }
                    }), 
                ]
                  
                }),
                new Paragraph({
                  spacing: {
                    before: 100,
                    after: 200,
                  },
                  children: [new ImageRun({
                  data:  Uint8Array.from(atob((v.find(img => img.id === 'idbytypesvg')).image.replace('data:image/png;base64,', '')),c=>c.charCodeAt(0)),
                  transformation: {
                    width: 800,
                    height: 150
                  },
                })]}),
                getImages(v, parentState.totalResponseDisagregatedByPartner, ''),
                new Paragraph({
                  spacing: {
                    before: 0,
                    after: 50,
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
                    text: 'Effective Response Rate',
                    color: '#000000',
                    size: 24,
                    bold:true,
                    style: {
                      size: 24,
                      color: '#000000',
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
                      text: 'Total Effective Response',
                      size: 20,
                      color: '#797980',
                      style: {
                        size: 20,
                        color: '#797980',
                      }
                    }), 
                ]
                  
                }),
                new Paragraph({
                  spacing: {
                    before: 100,
                    after: 200,
                  },
                  children: [new ImageRun({
                  data:  Uint8Array.from(atob((v.find(img => img.id === 'idtotalEffectiveResponseChartsvg')).image.replace('data:image/png;base64,', '')),c=>c.charCodeAt(0)),
                  transformation: {
                    width: 450,
                    height: 100
                  },
                })]}),

                getImages(v, parentState.totalEffectiveResponseDisagregatedByPartner, '2'),
                ...getGroupData(parentState),
                ...getLastPart(parentState)
          
              ]
            }
        ];
          resolve(new Document({
            sections: sections
          }))
        })
  })}
};
