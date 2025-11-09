import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

interface SupportChannel {
  icon: string;
  title: string;
  description: string;
  value: string;
  action?: string;
}

@Component({
  selector: 'app-contato',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    InputTextModule,
    TextareaModule,
    ButtonModule,
    DividerModule,
    TagModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.scss']
})
export class ContatoComponent {

  isSubmitting = false;

  officeInfo = {
    name: 'Central Operacional - Miku Express',
    address: 'Avenida das Estrelas, 390',
    district: 'Distrito Vibrato',
    city: 'Tóquio, Japão',
    zipCode: '120-0034',
    phone: '+55 (11) 4002-8922',
    email: 'contato@mikuexpress.com',
    supportHours: 'Segunda a Sexta | 08h00 às 19h00',
    supportHoursWeekend: 'Sábados | 09h00 às 13h00'
  };

  supportChannels: SupportChannel[] = [
    {
      icon: 'pi pi-envelope',
      title: 'Suporte Geral',
      description: 'Questões sobre entregas, cotações e agendamentos.',
      value: 'suporte@mikuexpress.com'
    },
    {
      icon: 'pi pi-briefcase',
      title: 'Atendimento Empresarial',
      description: 'Projetos logísticos personalizados para sua empresa.',
      value: 'corporativo@mikuexpress.com'
    },
    {
      icon: 'pi pi-headset',
      title: 'Canal WhatsMiku',
      description: 'Equipe online em tempo real para dúvidas urgentes.',
      value: '+55 (11) 98888-7777',
      action: 'Atendimento 24/7'
    }
  ];

  socialLinks = [
    { icon: 'pi pi-instagram', label: '@mikuexpress', url: '#' },
    { icon: 'pi pi-facebook', label: '/mikuexpress', url: '#' },
    { icon: 'pi pi-twitter', label: '@mikuexpress', url: '#' }
  ];

  formData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  constructor(private messageService: MessageService) {}

  enviarMensagem(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Por favor, preencha todos os campos obrigatórios.'
      });
      return;
    }

    this.isSubmitting = true;
    setTimeout(() => {
      this.isSubmitting = false;
      this.messageService.add({
        severity: 'success',
        summary: 'Mensagem enviada!',
        detail: 'Nossa equipe retornará o contato em até 24 horas úteis.'
      });
      form.resetForm();
    }, 800);
  }
}

