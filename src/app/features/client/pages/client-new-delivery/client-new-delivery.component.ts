import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ClientDeliveriesService } from '../../data/client-deliveries.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-client-new-delivery',
  standalone: false,
  templateUrl: './client-new-delivery.component.html',
  styleUrls: ['./client-new-delivery.component.scss'],
})
export class ClientNewDeliveryComponent {
  form = {
    pickupAddress: '',
    deliveryAddress: '',
    description: '',
    weightKg: 1,
    offeredPrice: 10,
  };

  submitting = false;
  submitError: string | null = null;
  submitSuccess: string | null = null;

  constructor(
    private readonly clientDeliveries: ClientDeliveriesService,
    private readonly router: Router,
  ) {}

  createDelivery(): void {
    this.submitError = null;
    this.submitSuccess = null;

    const payload = {
      pickupAddress: this.form.pickupAddress.trim(),
      deliveryAddress: this.form.deliveryAddress.trim(),
      description: this.form.description.trim(),
      weightKg: Number(this.form.weightKg),
      offeredPrice: Number(this.form.offeredPrice),
    };

    if (!payload.pickupAddress || !payload.deliveryAddress || !payload.description) {
      this.submitError = 'Preencha coleta, entrega e descrição.';
      return;
    }

    if (!Number.isFinite(payload.weightKg) || payload.weightKg <= 0) {
      this.submitError = 'Peso deve ser maior que zero.';
      return;
    }

    if (!Number.isFinite(payload.offeredPrice) || payload.offeredPrice <= 0) {
      this.submitError = 'Preço ofertado deve ser maior que zero.';
      return;
    }

    this.submitting = true;
    this.clientDeliveries.createDelivery(payload).subscribe({
      next: () => {
        this.submitting = false;
        this.submitSuccess = 'Entrega solicitada com sucesso.';
        void this.router.navigate(['/client']);
      },
      error: (err: unknown) => {
        this.submitting = false;
        const httpError = err as HttpErrorResponse;
        const apiMessage = (httpError?.error as { error?: string } | null)?.error;
        this.submitError = apiMessage && apiMessage.trim()
          ? apiMessage
          : 'Não foi possível solicitar a entrega.';
      },
    });
  }

  mapLink(address: string): string {
    const q = encodeURIComponent(address);
    return `https://www.openstreetmap.org/search?query=${q}`;
  }
}
