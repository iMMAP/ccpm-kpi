import {
  Document,
} from "docx";
import { isArray, isString } from "underscore";

import ReportViewItem from './ccpmDocxItem';

export class DocumentCreator {
  create(data) {
    const { tnslIndex, reportData } = data;

    const document = new Document({

      sections: reportData.filter(e => e.data.provided).map((rowContent, i) => {
        let label = t('Unlabeled');
        if (isArray(rowContent.row.label)) {
          label = rowContent.row.label[tnslIndex];
        } else if (isString(rowContent.row.label)) {
          label = rowContent.row.label;
        }

        return (
          ReportViewItem({ ...rowContent, label, id: `${i}-chart` })
        );
      })

    });

    return document;
  }
}
