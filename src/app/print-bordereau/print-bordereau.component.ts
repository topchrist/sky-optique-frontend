import {Component, Inject, LOCALE_ID, OnInit} from '@angular/core';
import {FactureClientModel} from "../models/factureClient.model";
import {ActivatedRoute, Router} from "@angular/router";
import {FactureClientService} from "../services/factureClient.service";
import {BordereauService} from "../services/bordereau.service";
import {BordereauModel} from "../models/bordereau.model";
import {LentilleModel} from "../models/lentille.model";
import {formatDate} from "@angular/common";

@Component({
  selector: 'app-print-bordereau',
  templateUrl: './print-bordereau.component.html',
  styleUrls: ['./print-bordereau.component.css']
})
export class PrintBordereauComponent implements OnInit {

  pdfMake: any;
  bordereau : BordereauModel = null;
  total = 0;
  id : number;

  constructor(@Inject(LOCALE_ID) private locale: string,
    private router: Router,
              private route: ActivatedRoute,
              private bordereauService : BordereauService) {
    this.id = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.bordereauService.getBordereauById(this.id).subscribe((response) => {
        this.bordereau = response;
        this.calculValeur();
        this.generatePdf('open', this.bordereau);
      },(error) => {
        console.log('Erreur ! : ' + error);
      }
    );
  }

  calculValeur(){
    this.total = 0;
    this.bordereau.factureClients.forEach(value => {
      this.total += value.couvertures[0].priseEnCharge;
    });
  }
  formatMillier( nombre){
    nombre += '';
    var sep = ' ';
    var reg = /(\d+)(\d{3})/;
    while( reg.test( nombre)) {
      nombre = nombre.replace( reg, '$1' +sep +'$2');
    }
    return nombre;
  }
  onDateFormat(date: any) {

    return formatDate(date,'dd-MM-yyyy', this.locale);
  }

  async loadPdfMaker() {
    if (!this.pdfMake) {
      const pdfMakeModule = await import('pdfmake/build/pdfmake');
      const pdfFontsModule = await import('pdfmake/build/vfs_fonts');
      this.pdfMake = pdfMakeModule.default;
      this.pdfMake.vfs = pdfFontsModule.default.pdfMake.vfs;
    }
  }
  async generatePdf(action: string, bordereau : BordereauModel) {
    await this.loadPdfMaker();

    let docDefinition = {
      content: [
        {
          columns: [
            [
              {
                text: 'TRANSMISSION : '+this.bordereau.numero,
                fontSize: 16,
                bold: true,
                alignment: 'left',
                margin: [0, 60, 0, 0],
              }
            ],
            [
              {
                text: 'Douala, le '+ this.onDateFormat(bordereau.createAt),
                fontSize: 12,
                bold: true,
                alignment: 'right',
                margin: [0, 60, 0, 0],
              },
            ]
          ],
          margin: [0, 0, 0, 15],
        },
        {
          columns: [
            [],
            [
              {
                table: {
                  headerRows: 1,
                  widths: ['*'],
                  body: [
                    [
                      {
                        layout: 'noBorders',
                        table: {
                          headerRows: 1,
                          widths: [ 'auto', '*'],
                          body: [
                            [ 'Client : ',{text: bordereau.assurance?bordereau.assurance.nom:''}],
                            [ 'Téléphone : ', {text: bordereau.assurance?bordereau.assurance.tel1:''}],
                          ]
                        }
                      }
                    ]
                  ]
                }
              }
            ]
          ]
        },
        {

          table: {
            headerRows: 1,
            widths: [ 50, 60, 90, 90, 50, 55, '*'],
            body: [
              [ { text: 'N° Facture', bold: true, alignment: 'center', fontSize: 10}, { text: 'Souscripteur', bold: true, alignment: 'center', fontSize: 10 }, { text: 'Patient', bold: true, alignment: 'center', fontSize: 10 }, { text: 'Assuré', bold: true, alignment: 'center', fontSize: 10 }, { text: 'N° BPC', bold: true, alignment: 'center', fontSize: 10 }, { text: 'Date', bold: true, alignment: 'center', fontSize: 10 }, { text: 'Total', bold: true, alignment: 'center', fontSize: 10 } ],
              ...this.bordereau.factureClients.map(p => ([ {text: p.numero, alignment: 'left', fontSize: 10}, {text: p.couvertures[0].entreprise.nom, alignment: 'left', fontSize: 10}, {text: p.patient.nom+' '+p.patient.prenom?p.patient.prenom:'', alignment: 'left', fontSize: 10}, {text: p.couvertures[0].assurePrincipal.nom+' '+p.couvertures[0].assurePrincipal.prenom?p.couvertures[0].assurePrincipal.prenom:'', alignment: 'left', fontSize: 10}, {text: this.formatMillier(p.couvertures[0].priseEnCharge), alignment: 'right', fontSize: 10}, {text: this.onDateFormat(p.createAt), alignment: 'left', fontSize: 10}, {text: this.formatMillier(p.couvertures[0].priseEnCharge), alignment: 'right', fontSize: 10} ])),
              [ {text: 'TOTAL', alignment: 'center', bold: true, colSpan: 6 }, {}, {}, {}, {},{}, {text: this.formatMillier(this.total), bold: true, alignment: 'right'} ],
            ]
          },
          margin: [0, 20, 0, 0],
        }
      ],
      styles: {
        defaultStyle: {
          decoration: 'underline',
          fontSize: 10,
        },
      }
    }

    if(action==='download'){
      this.pdfMake.createPdf(docDefinition).download();
    }else if(action === 'print'){
      this.pdfMake.createPdf(docDefinition).print();
    }else{
      this.pdfMake.createPdf(docDefinition).open();
    }

    window.history.back();

  }


}
