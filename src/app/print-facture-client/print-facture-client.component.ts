import { Component, OnInit } from '@angular/core';
import {VenteModel} from "../models/vente.model";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {FactureClientModel} from "../models/factureClient.model";
import {ActivatedRoute, Router} from "@angular/router";
import {FactureClientService} from "../services/factureClient.service";
import {CouvertureModel} from "../models/couverture.model";
import {LentilleModel} from "../models/lentille.model";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-print-facture-client',
  templateUrl: './print-facture-client.component.html',
  styleUrls: ['./print-facture-client.component.css']
})
export class PrintFactureClientComponent implements OnInit {

  pdfMake: any;

  facture : FactureClientModel = null;
  ventes : VenteModel[] = [];

  couverture : CouvertureModel = null;
  listMonture : VenteModel[] = null;
  listLentilleG : VenteModel[] =null;
  listLentilleD : VenteModel[] =null;
  montantHT : number = 0;
  remiseT : number = 0;
  taxe : number = 0;
  net : number = 0;
  id : number;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private factureClientService : FactureClientService) {

    this.id = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.factureClientService.getFactureClientById(this.id).subscribe((response) => {
        this.facture = response;
        this.listMonture = this.facture.ventes.filter(value => value.libelle =="monture");
        this.listLentilleD = this.facture.ventes.filter(value => value.libelle =="lentilleD");
        this.listLentilleG = this.facture.ventes.filter(value => value.libelle =="lentilleG");
        this.calculValeur();
        this.generatePdf('open', this.facture);
        console.log(this.facture);
      },(error) => {
        console.log('Erreur ! : ' + error);
      }
    );
  }

  calculValeur(){
    this.montantHT = 0;
    this.remiseT = 0;
    this.taxe = 0;
    this.net = 0;
    this.facture.ventes.forEach(value => {
      this.montantHT += value.pu*value.qte;
      this.net += value.total;
      this.remiseT += (value.pu-value.montant)*value.qte;
    });
    if(this.facture.couvertures && this.facture.couvertures[0]){
      this.couverture = this.facture.couvertures[0];
    }
  }

  Unite( nombre ){
    var unite;
    switch( nombre ){
      case 0: unite = "zéro";		break;
      case 1: unite = "un";		break;
      case 2: unite = "deux";		break;
      case 3: unite = "trois"; 	break;
      case 4: unite = "quatre"; 	break;
      case 5: unite = "cinq"; 	break;
      case 6: unite = "six"; 		break;
      case 7: unite = "sept"; 	break;
      case 8: unite = "huit"; 	break;
      case 9: unite = "neuf"; 	break;
    }//fin switch
    return unite;
  }//-----------------------------------------------------------------------

  Dizaine( nombre ){
    var dizaine;
    switch( nombre ){
      case 10: dizaine = "dix"; break;
      case 11: dizaine = "onze"; break;
      case 12: dizaine = "douze"; break;
      case 13: dizaine = "treize"; break;
      case 14: dizaine = "quatorze"; break;
      case 15: dizaine = "quinze"; break;
      case 16: dizaine = "seize"; break;
      case 17: dizaine = "dix-sept"; break;
      case 18: dizaine = "dix-huit"; break;
      case 19: dizaine = "dix-neuf"; break;
      case 20: dizaine = "vingt"; break;
      case 30: dizaine = "trente"; break;
      case 40: dizaine = "quarante"; break;
      case 50: dizaine = "cinquante"; break;
      case 60: dizaine = "soixante"; break;
      case 70: dizaine = "soixante-dix"; break;
      case 80: dizaine = "quatre-vingt"; break;
      case 90: dizaine = "quatre-vingt-dix"; break;
    }//fin switch
    return dizaine;
  }//-----------------------------------------------------------------------

  NumberToLetter( nombre ){
    var i, j, n, quotient, reste, nb ;
    var ch
    var numberToLetter='';
    //__________________________________

    if(  nombre.toString().replace( / /gi, "" ).length > 15  )	return "dépassement de capacité";
    if(  isNaN(nombre.toString().replace( / /gi, "" ))  )		return "Nombre non valide";

    nb = parseFloat(nombre.toString().replace( / /gi, "" ));
    if(  Math.ceil(nb) != nb  )	return  "Nombre avec virgule non géré.";

    n = nb.toString().length;
    switch( n ){
      case 1: numberToLetter = this.Unite(nb); break;
      case 2: if(  nb > 19  ){
        quotient = Math.floor(nb / 10);
        reste = nb % 10;
        if(  nb < 71 || (nb > 79 && nb < 91)  ){
          if(  reste == 0  ) numberToLetter = this.Dizaine(quotient * 10);
          if(  reste == 1  ) numberToLetter = this.Dizaine(quotient * 10) + "-et-" + this.Unite(reste);
          if(  reste > 1   ) numberToLetter = this.Dizaine(quotient * 10) + "-" + this.Unite(reste);
        }else numberToLetter = this.Dizaine((quotient - 1) * 10) + "-" + this.Dizaine(10 + reste);
      }else numberToLetter = this.Dizaine(nb);
        break;
      case 3: quotient = Math.floor(nb / 100);
        reste = nb % 100;
        if(  quotient == 1 && reste == 0   ) numberToLetter = "cent";
        if(  quotient == 1 && reste != 0   ) numberToLetter = "cent" + " " + this.NumberToLetter(reste);
        if(  quotient > 1 && reste == 0    ) numberToLetter = this.Unite(quotient) + " cents";
        if(  quotient > 1 && reste != 0    ) numberToLetter = this.Unite(quotient) + " cent " + this.NumberToLetter(reste);
        break;
      case 4 :  quotient = Math.floor(nb / 1000);
        reste = nb - quotient * 1000;
        if(  quotient == 1 && reste == 0   ) numberToLetter = "mille";
        if(  quotient == 1 && reste != 0   ) numberToLetter = "mille" + " " + this.NumberToLetter(reste);
        if(  quotient > 1 && reste == 0    ) numberToLetter = this.NumberToLetter(quotient) + " mille";
        if(  quotient > 1 && reste != 0    ) numberToLetter = this.NumberToLetter(quotient) + " mille " + this.NumberToLetter(reste);
        break;
      case 5 :  quotient = Math.floor(nb / 1000);
        reste = nb - quotient * 1000;
        if(  quotient == 1 && reste == 0   ) numberToLetter = "mille";
        if(  quotient == 1 && reste != 0   ) numberToLetter = "mille" + " " + this.NumberToLetter(reste);
        if(  quotient > 1 && reste == 0    ) numberToLetter = this.NumberToLetter(quotient) + " mille";
        if(  quotient > 1 && reste != 0    ) numberToLetter = this.NumberToLetter(quotient) + " mille " + this.NumberToLetter(reste);
        break;
      case 6 :  quotient = Math.floor(nb / 1000);
        reste = nb - quotient * 1000;
        if(  quotient == 1 && reste == 0   ) numberToLetter = "mille";
        if(  quotient == 1 && reste != 0   ) numberToLetter = "mille" + " " + this.NumberToLetter(reste);
        if(  quotient > 1 && reste == 0    ) numberToLetter = this.NumberToLetter(quotient) + " mille";
        if(  quotient > 1 && reste != 0    ) numberToLetter = this.NumberToLetter(quotient) + " mille " + this.NumberToLetter(reste);
        break;
      case 7: quotient = Math.floor(nb / 1000000);
        reste = nb % 1000000;
        if(  quotient == 1 && reste == 0  ) numberToLetter = "un million";
        if(  quotient == 1 && reste != 0  ) numberToLetter = "un million" + " " + this.NumberToLetter(reste);
        if(  quotient > 1 && reste == 0   ) numberToLetter = this.NumberToLetter(quotient) + " millions";
        if(  quotient > 1 && reste != 0   ) numberToLetter = this.NumberToLetter(quotient) + " millions " + this.NumberToLetter(reste);
        break;
      case 8: quotient = Math.floor(nb / 1000000);
        reste = nb % 1000000;
        if(  quotient == 1 && reste == 0  ) numberToLetter = "un million";
        if(  quotient == 1 && reste != 0  ) numberToLetter = "un million" + " " + this.NumberToLetter(reste);
        if(  quotient > 1 && reste == 0   ) numberToLetter = this.NumberToLetter(quotient) + " millions";
        if(  quotient > 1 && reste != 0   ) numberToLetter = this.NumberToLetter(quotient) + " millions " + this.NumberToLetter(reste);
        break;
      case 9: quotient = Math.floor(nb / 1000000);
        reste = nb % 1000000;
        if(  quotient == 1 && reste == 0  ) numberToLetter = "un million";
        if(  quotient == 1 && reste != 0  ) numberToLetter = "un million" + " " + this.NumberToLetter(reste);
        if(  quotient > 1 && reste == 0   ) numberToLetter = this.NumberToLetter(quotient) + " millions";
        if(  quotient > 1 && reste != 0   ) numberToLetter = this.NumberToLetter(quotient) + " millions " + this.NumberToLetter(reste);
        break;
      case 10: quotient = Math.floor(nb / 1000000000);
        reste = nb - quotient * 1000000000;
        if(  quotient == 1 && reste == 0  ) numberToLetter = "un milliard";
        if(  quotient == 1 && reste != 0  ) numberToLetter = "un milliard" + " " + this.NumberToLetter(reste);
        if(  quotient > 1 && reste == 0   ) numberToLetter = this.NumberToLetter(quotient) + " milliards";
        if(  quotient > 1 && reste != 0   ) numberToLetter = this.NumberToLetter(quotient) + " milliards " + this.NumberToLetter(reste);
        break;
      case 11: quotient = Math.floor(nb / 1000000000);
        reste = nb - quotient * 1000000000;
        if(  quotient == 1 && reste == 0  ) numberToLetter = "un milliard";
        if(  quotient == 1 && reste != 0  ) numberToLetter = "un milliard" + " " + this.NumberToLetter(reste);
        if(  quotient > 1 && reste == 0   ) numberToLetter = this.NumberToLetter(quotient) + " milliards";
        if(  quotient > 1 && reste != 0   ) numberToLetter = this.NumberToLetter(quotient) + " milliards " + this.NumberToLetter(reste);
        break;
      case 12: quotient = Math.floor(nb / 1000000000);
        reste = nb - quotient * 1000000000;
        if(  quotient == 1 && reste == 0  ) numberToLetter = "un milliard";
        if(  quotient == 1 && reste != 0  ) numberToLetter = "un milliard" + " " + this.NumberToLetter(reste);
        if(  quotient > 1 && reste == 0   ) numberToLetter = this.NumberToLetter(quotient) + " milliards";
        if(  quotient > 1 && reste != 0   ) numberToLetter = this.NumberToLetter(quotient) + " milliards " + this.NumberToLetter(reste);
        break;
      case 13: quotient = Math.floor(nb / 1000000000000);
        reste = nb - quotient * 1000000000000;
        if(  quotient == 1 && reste == 0  ) numberToLetter = "un billion";
        if(  quotient == 1 && reste != 0  ) numberToLetter = "un billion" + " " + this.NumberToLetter(reste);
        if(  quotient > 1 && reste == 0   ) numberToLetter = this.NumberToLetter(quotient) + " billions";
        if(  quotient > 1 && reste != 0   ) numberToLetter = this.NumberToLetter(quotient) + " billions " + this.NumberToLetter(reste);
        break;
      case 14: quotient = Math.floor(nb / 1000000000000);
        reste = nb - quotient * 1000000000000;
        if(  quotient == 1 && reste == 0  ) numberToLetter = "un billion";
        if(  quotient == 1 && reste != 0  ) numberToLetter = "un billion" + " " + this.NumberToLetter(reste);
        if(  quotient > 1 && reste == 0   ) numberToLetter = this.NumberToLetter(quotient) + " billions";
        if(  quotient > 1 && reste != 0   ) numberToLetter = this.NumberToLetter(quotient) + " billions " + this.NumberToLetter(reste);
        break;
      case 15: quotient = Math.floor(nb / 1000000000000);
        reste = nb - quotient * 1000000000000;
        if(  quotient == 1 && reste == 0  ) numberToLetter = "un billion";
        if(  quotient == 1 && reste != 0  ) numberToLetter = "un billion" + " " + this.NumberToLetter(reste);
        if(  quotient > 1 && reste == 0   ) numberToLetter = this.NumberToLetter(quotient) + " billions";
        if(  quotient > 1 && reste != 0   ) numberToLetter = this.NumberToLetter(quotient) + " billions " + this.NumberToLetter(reste);
        break;
    }//fin switch
    /*respect de l'accord de quatre-vingt*/
    if(  numberToLetter.substr(numberToLetter.length-"quatre-vingt".length,"quatre-vingt".length) == "quatre-vingt"  ) numberToLetter = numberToLetter + "s";

    return numberToLetter;
  }//-----------------------------------------------------------------------

  formatMillier( nombre){
    nombre += '';
    var sep = ' ';
    var reg = /(\d+)(\d{3})/;
    while( reg.test( nombre)) {
      nombre = nombre.replace( reg, '$1' +sep +'$2');
    }
    return nombre;
  }

  formatWithSigne(nombre){
    const MyFormat = new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits:2} );
    let y = MyFormat.format(nombre);
    return nombre<0 ? y : '+'+y;
  }



  async loadPdfMaker() {
    if (!this.pdfMake) {
      const pdfMakeModule = await import('pdfmake/build/pdfmake');
      const pdfFontsModule = await import('pdfmake/build/vfs_fonts');
      this.pdfMake = pdfMakeModule.default;
      this.pdfMake.vfs = pdfFontsModule.default.pdfMake.vfs;
    }
  }

  async generatePdf(action: string, proforma : FactureClientModel) {
    await this.loadPdfMaker();

    let docDefinition = {
      content: [
        {
          columns: [
            [
              {
                text: 'FACTURE : '+this.facture.numero,
                fontSize: 16,
                bold: true,
                alignment: 'left',
                margin: [0, 60, 0, 0],
              }
            ],
            [
              {
                text: 'Douala, le '+ `${new Date(proforma.createAt).toLocaleString()}`,
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
            [
              {
                text: 'TIERS PAYANT',
                bold: true,
                alignment: 'left',
              },
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
                          widths: ['auto', '*'],
                          body: [
                            ['Assurance : ', {text: proforma.couvertures.length>0?proforma.couvertures[0].assurance.nom:'', bold: true}],
                            ['Niu : ', {}],
                            ['Rccm : ', {}],
                            ['BP : ', {text: proforma.couvertures.length>0&&proforma.couvertures[0].entreprise?proforma.couvertures[0].entreprise.bp:''}],
                            ['Localisation : ', {text: proforma.couvertures.length>0&&proforma.couvertures[0].entreprise?proforma.couvertures[0].entreprise.adresse:''}],
                          ]
                        }
                      },
                    ],
                  ]
                }
              }
            ],
            [
              {
                text: 'ASSURE',
                bold: true,
                alignment: 'right',
              },
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
                            [ 'Assuré : ',{text: proforma.couvertures.length>0?(proforma.couvertures[0].assurePrincipal.nom+' '+(proforma.couvertures[0].assurePrincipal.prenom?proforma.couvertures[0].assurePrincipal.prenom:'')):''}],
                            [ 'Entreprise : ', {text: proforma.couvertures.length>0?proforma.couvertures[0].entreprise.nom:''}],
                            [ 'No BPC : ', {}],
                            [ 'Patient : ', {text: proforma.patient.nom+' '+(proforma.patient.prenom?proforma.patient.prenom:'')}],
                            [ 'Relation : ', {text: proforma.couvertures.length>0?proforma.couvertures[0].relation:''}],
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
          layout: 'headerLineOnly',
          table: {
            headerRows: 1,
            widths: [ '*', 'auto', 'auto', 'auto', 'auto'],
            body: [
              [ { text: 'Désignition', bold: true }, { text: 'Pu', bold: true, alignment: 'right' }, { text: 'Qté', bold: true, alignment: 'right' }, { text: 'Remise', bold: true, alignment: 'right' }, { text: 'Total', bold: true, alignment: 'right' } ],
              [ { text: 'VERRES', bold: true, decoration: 'underline', colSpan: 5 }, {}, {}, {}, {} ],
              ...this.listLentilleD.map(p => (['--> OD : '+p.stock.produit.libelle+'\n'+this.formatWithSigne((p.stock.produit as LentilleModel).sphere)+'('+this.formatWithSigne((p.stock.produit as LentilleModel).cylindre)+')'+(((p.stock.produit as LentilleModel).axe)?(p.stock.produit as LentilleModel).axe+'°':'')+(((p.stock.produit as LentilleModel).addition && (p.stock.produit as LentilleModel).addition!=0)?' Add '+this.formatWithSigne((p.stock.produit as LentilleModel).addition):''), {text: this.formatMillier(p.pu), alignment: 'right'}, {text: this.formatMillier(p.qte), alignment: 'right'}, {text: (this.formatMillier(p.pu-p.montant))+' ('+p.remise+'%)', alignment: 'right'}, {text: this.formatMillier(p.total), alignment: 'right'} ])),
              ...this.listLentilleG.map(p => (['--> OG : '+p.stock.produit.libelle+'\n'+this.formatWithSigne((p.stock.produit as LentilleModel).sphere)+'('+this.formatWithSigne((p.stock.produit as LentilleModel).cylindre)+')'+(((p.stock.produit as LentilleModel).axe)?(p.stock.produit as LentilleModel).axe+'°':'')+(((p.stock.produit as LentilleModel).addition && (p.stock.produit as LentilleModel).addition!=0)?' Add '+this.formatWithSigne((p.stock.produit as LentilleModel).addition):''), {text: this.formatMillier(p.pu), alignment: 'right'}, {text: this.formatMillier(p.qte), alignment: 'right'}, {text: (this.formatMillier(p.pu-p.montant))+' ('+p.remise+'%)', alignment: 'right'}, {text: this.formatMillier(p.total), alignment: 'right'} ])),
              [ {}, {}, {}, {}, {} ],
              [ { text: 'MONTURES', bold: true, decoration: 'underline', colSpan: 5 }, {}, {}, {}, {} ],
              ...this.listMonture.map(p => (['--> '+p.stock.produit.libelle, {text: this.formatMillier(p.pu), alignment: 'right'}, {text: this.formatMillier(p.qte), alignment: 'right'}, {text: (this.formatMillier(p.pu-p.montant))+' ('+p.remise+'%)', alignment: 'right'}, {text: this.formatMillier(p.total), alignment: 'right'} ])),
              [ {}, {}, {}, {}, {} ],
            ]
          },
          margin: [0, 20, 0, 0],
        },
        {
          layout: 'headerLineOnly',
          table: {
            headerRows: 1,
            widths: [ '*', '*', 'auto'],
            body: [
              [ {}, {}, {} ],
              [ {}, {}, {} ],
              [ {}, {}, {} ],
              [ {}, {text: 'Montant HT', alignment: 'left'}, {text: this.formatMillier(this.montantHT), alignment: 'right', bold: true,} ],
              [ {}, {text: 'Remise', alignment: 'left'}, {text: this.formatMillier(this.remiseT), alignment: 'right', bold: true,} ],
              [ {}, {text: 'Taxe', alignment: 'left'}, {text: this.formatMillier(this.taxe), alignment: 'right', bold: true,} ],
              [ {}, {text: 'Net', alignment: 'left'}, {text: this.formatMillier(this.net), alignment: 'right', bold: true,} ],
              [ {}, {text: 'Couverture', alignment: 'left'}, {text: this.couverture?this.formatMillier(this.couverture.priseEnCharge):'', alignment: 'right', bold: true,} ],
              [ {}, {text: 'Franchise', alignment: 'left'}, {text: this.couverture?this.formatMillier(this.couverture.franchise):'', alignment: 'right', bold: true,} ],
              [ {}, {}, {} ],
              [ {}, {}, {} ],
            ]
          }
        },
        {
          layout: 'noBorders',
          table: {
            headerRows: 1,
            widths: [ 'auto', '*'],
            body: [
              [ {}, {} ],
              [ {text: 'Arreté cette proforma à la somme de', alignment: 'left'}, {text: this.NumberToLetter(this.net)+' Francs CFA', alignment: 'left', bold: true, italics: true} ],
            ]
          }
        },
        {
          text: "L'OPTICIEN",
          fontSize: 14,
          bold: true,
          alignment: 'right',
          margin: [0, 20, 50, 30],
        },

      ],
      styles: {
        sectionHeader: {
          decoration: 'underline',
          fontSize: 30,
          margin: [0, 30, 0, 30],
        },
        footer: {
          fontSize: 22,
          bold: true,
          height: 150
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
