
import { Component, OnInit, TemplateRef } from '@angular/core';
import { eventoService } from '../services/evento.service';
import { Evento } from '../models/Evento';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit {

  modalRef?: BsModalRef;

  public eventos: Evento[] = []; 
  public eventosFiltrados : Evento[] = [];

  public larguraImagem: number = 150;
  public margemImagem = 2;
  public exibirImagem = true;
  private filtroListado = '';

  public get filtroLista() : string{
    return this.filtroListado;
  }

  public set filtroLista(value: string){
   this.filtroListado = value;
   this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }

  public filtrarEventos(filtrarPor: string): Evento[]{
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
    (evento: { tema: string; local: string; }) => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
    evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  constructor(
    private eventoService : eventoService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) { }

  public ngOnInit(): void {
    this.spinner.show();
    setTimeout(() => { 
    }, 5000);
    
    this.getEventos();
  }

  public alterarImagem(): void{
    this.exibirImagem = !this.exibirImagem;
  }

  public getEventos(): void{
    this.eventoService.getEventos().subscribe({
      next: (eventosResp : Evento[]) => {
        this.eventos = eventosResp;
        this.eventosFiltrados = this.eventos;
      },
      error: (error : any)=> {
        this.spinner.hide()
        this.toastr.error('Erro ao carregar os eventos!', 'Erro!');
      },
      complete:() => this.spinner.hide()
    });
  }
  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }
 
  confirm(): void {
    this.modalRef?.hide();
      this.toastr.success('O evento foi deletado com sucesso!', 'Deletado!');
  }
 
  decline(): void {
    this.modalRef?.hide();
  }

}
