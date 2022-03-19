import { Injectable } from '@angular/core';
import {ProformaModel} from "../models/Proforma.model";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  pdfMake: any;

  constructor() { }

  async loadPdfMaker() {
    if (!this.pdfMake) {
      const pdfMakeModule = await import('pdfmake/build/pdfmake');
      const pdfFontsModule = await import('pdfmake/build/vfs_fonts');
      this.pdfMake = pdfMakeModule.default;
      this.pdfMake.vfs = pdfFontsModule.default.pdfMake.vfs;
    }
  }

  async generatePdf(action: string, proforma : ProformaModel) {
    await this.loadPdfMaker();

    let docDefinition = {
      header: [
        {
          text: 'LOGO',
        },
        {
          text: 'FACTURE PROFORMA',
          fontSize: 14,
          bold: true,
          alignment: 'left',
          decoration: 'underline',
        },
      ],
      content: [
        {
          columns: [
            [
              {
                text: 'NUMERO',
                fontSize: 16,
                bold: true,
                alignment: 'left',
              }
            ],
            [
              {
                text: `${new Date(proforma.createAt).toLocaleString()}`,
                fontSize: 12,
                bold: true,
                alignment: 'right',
              },
            ]
          ]
        },
        {
          columns: [
            [
              {
                layout: 'noBorders',
                table: {
                  // headers are automatically repeated if the table spans over multiple pages
                  // you can declare how many rows should be treated as headers
                  headerRows: 1,
                  widths: [ '*'],
                  body: [
                    [ 'numero'],
                    [
                      {
                        text: proforma.prescription.prescripteur.titre+' '+proforma.prescription.prescripteur.nom+' '+proforma.prescription.prescripteur.prenom,
                        bold: true,
                      },
                    ],
                    [
                      'Date prescription'
                    ],
                    [
                      proforma.prescription.datePrescription
                    ],
                  ]
                }
              },
            ],
            [
              {
                layout: 'noBorders',
                table: {
                  // headers are automatically repeated if the table spans over multiple pages
                  // you can declare how many rows should be treated as headers
                  headerRows: 1,
                  widths: [ 'auto', '*'],
                  body: [
                    [ 'Patient : ', proforma.patient.nom],
                    [ 'Télephone : ', (proforma.patient.tel1?proforma.patient.tel1:'')],
                    [ 'Société : ', proforma.patient.entreprise?proforma.patient.entreprise.nom:''],
                  ]
                }
              }
            ]
          ]
        },
        {
          layout: 'headerLineOnly',
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: [ '*', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: [
              [ 'Désignition', 'Pu', 'Qté', 'Remise', 'Montant', 'Total' ],
              [ 'Désignition', 'Pu', 'Qté', 'Remise', 'Montant', 'Total' ],

            ]
          }
        }
      ],
      styles: {
        sectionHeader: {
          decoration: 'underline',
          fontSize: 30,
          margin: [0, 30, 0, 30],
        }
      }
    }

    if(action==='download'){
      this.pdfMake.createPdf(docDefinition).download();
    }else if(action === 'print'){
      this.pdfMake.createPdf(docDefinition).print();
    }else{
      this.pdfMake.createPdf(docDefinition).open();
    }

  }

}
