import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TabStopPosition,
  TabStopType,
  TextRun
} from "docx";

import ReportViewItem from './ccpm-docxItem';

export class DocumentCreator {
  // tslint:disable-next-line: typedef
  create(data){
    const {tnslIndex, reportData} = data;
    const canv = window.document.getElementsByClassName("chartjs-render-monitor");
    console.log(canv);
    if(canv[0]){
      console.log(canv[0].toDataURL())
    } 

    const document = new Document({
      sections: reportData.filter(e=>e.data.provided).map((rowContent, i)=>{
          let label = t('Unlabeled');
          if (_.isArray(rowContent.row.label)) {
            label = rowContent.row.label[tnslIndex];
          } else if (_.isString(rowContent.row.label)) {
            label = rowContent.row.label;
          }

          return (
                ReportViewItem({...rowContent, label})
            );
        })
      
    });

    console.log(document);

    return document;
  }

}
