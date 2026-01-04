import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';

type OrderStatus = 'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export default function AdminOrders() {
  const [statusFilter, setStatusFilter] = useState<OrderStatus>('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [shippingDialogOpen, setShippingDialogOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState<string>('');
  const [estimatedDelivery, setEstimatedDelivery] = useState('');

  const { data: orders, isLoading, refetch } = trpc.orders.getAllOrders.useQuery();
  const markAsShipped = trpc.orders.markAsShipped.useMutation({
    onSuccess: () => {
      alert('Erfolg! Bestellung wurde als versandt markiert und Kunde benachrichtigt.');
      setShippingDialogOpen(false);
      setSelectedOrder(null);
      setTrackingNumber('');
      setCarrier('');
      setEstimatedDelivery('');
      refetch();
    },
    onError: (error) => {
      alert('Fehler: ' + (error.message || 'Fehler beim Aktualisieren der Bestellung'));
    },
  });

  const filteredOrders = orders?.filter(order => {
    if (statusFilter === 'all') return true;
    return order.status === statusFilter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'processing':
        return <Package className="w-4 h-4 text-blue-600" />;
      case 'shipped':
        return <Truck className="w-4 h-4 text-purple-600" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'Ausstehend',
      processing: 'In Bearbeitung',
      shipped: 'Versandt',
      delivered: 'Zugestellt',
      cancelled: 'Storniert',
    };
    return statusMap[status] || status;
  };

  const handleMarkAsShipped = () => {
    if (!selectedOrder || !trackingNumber || !carrier) {
      alert('Fehler: Bitte füllen Sie alle erforderlichen Felder aus');
      return;
    }

    markAsShipped.mutate({
      orderId: selectedOrder.id,
      trackingNumber,
      carrier: carrier as any,
      estimatedDelivery: estimatedDelivery || undefined,
    });
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Lade Bestellungen...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Bestellverwaltung</h1>
        <p className="text-muted-foreground">
          Verwalten Sie alle Bestellungen und markieren Sie sie als versandt
        </p>
      </div>

      {/* Status Filter */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {(['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'] as OrderStatus[]).map((status) => (
          <Button
            key={status}
            variant={statusFilter === status ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter(status)}
          >
            {status === 'all' ? 'Alle' : getStatusText(status)}
            {status !== 'all' && (
              <span className="ml-2 bg-background text-foreground rounded-full px-2 py-0.5 text-xs">
                {orders?.filter(o => o.status === status).length || 0}
              </span>
            )}
          </Button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders && filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <Card key={order.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {getStatusIcon(order.status)}
                    <div>
                      <h3 className="font-semibold text-lg">{order.orderNumber}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString('de-DE', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Kunde</p>
                      <p className="font-medium">{order.customerEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Gesamtbetrag</p>
                      <p className="font-medium">€{(order.totalAmount / 100).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <span className="font-medium">{getStatusText(order.status)}</span>
                      </div>
                    </div>
                  </div>

                  {order.trackingNumber && (
                    <div className="bg-accent/50 rounded-lg p-3 mb-4">
                      <p className="text-sm text-muted-foreground mb-1">Sendungsverfolgung</p>
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-mono font-semibold">{order.trackingNumber}</p>
                          <p className="text-sm text-muted-foreground">{order.carrier}</p>
                        </div>
                        {order.estimatedDelivery && (
                          <div className="ml-auto">
                            <p className="text-sm text-muted-foreground">Voraussichtlich</p>
                            <p className="font-medium">{order.estimatedDelivery}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {order.shippingMethod && (
                    <p className="text-sm text-muted-foreground">
                      Versandart: <span className="font-medium">{order.shippingMethod}</span>
                    </p>
                  )}
                </div>

                <div className="ml-4">
                  {order.status === 'processing' && (
                    <Button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShippingDialogOpen(true);
                      }}
                    >
                      <Truck className="w-4 h-4 mr-2" />
                      Als versandt markieren
                    </Button>
                  )}
                  {order.status === 'shipped' && (
                    <Button variant="outline" disabled>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Versandt
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-12 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Keine Bestellungen gefunden</h3>
            <p className="text-muted-foreground">
              {statusFilter === 'all'
                ? 'Es gibt noch keine Bestellungen'
                : `Keine Bestellungen mit Status "${getStatusText(statusFilter)}"`}
            </p>
          </Card>
        )}
      </div>

      {/* Shipping Dialog */}
      <Dialog open={shippingDialogOpen} onOpenChange={setShippingDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Bestellung als versandt markieren</DialogTitle>
            <DialogDescription>
              Geben Sie die Versandinformationen ein. Der Kunde erhält automatisch eine E-Mail mit
              der Sendungsnummer.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="tracking">Sendungsnummer *</Label>
              <Input
                id="tracking"
                placeholder="z.B. DHL123456789"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="carrier">Versanddienstleister *</Label>
              <Select value={carrier} onValueChange={setCarrier}>
                <SelectTrigger id="carrier">
                  <SelectValue placeholder="Wählen Sie einen Anbieter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DHL">DHL</SelectItem>
                  <SelectItem value="DPD">DPD</SelectItem>
                  <SelectItem value="Austrian Post">Österreichische Post</SelectItem>
                  <SelectItem value="Post">Post</SelectItem>
                  <SelectItem value="GLS">GLS</SelectItem>
                  <SelectItem value="Other">Sonstiges</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="delivery">Voraussichtliche Lieferung (optional)</Label>
              <Input
                id="delivery"
                type="date"
                value={estimatedDelivery}
                onChange={(e) => setEstimatedDelivery(e.target.value)}
              />
            </div>

            {selectedOrder && (
              <div className="bg-accent/50 rounded-lg p-4 mt-4">
                <p className="text-sm font-semibold mb-2">Bestelldetails</p>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-muted-foreground">Bestellnummer:</span>{' '}
                    <span className="font-medium">{selectedOrder.orderNumber}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Kunde:</span>{' '}
                    <span className="font-medium">{selectedOrder.customerEmail}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Betrag:</span>{' '}
                    <span className="font-medium">
                      €{(selectedOrder.totalAmount / 100).toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShippingDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleMarkAsShipped} disabled={markAsShipped.isPending}>
              {markAsShipped.isPending ? 'Wird gesendet...' : 'Versandt markieren & E-Mail senden'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
