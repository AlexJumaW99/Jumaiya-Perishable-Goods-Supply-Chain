/**
 * A transaction processor function allowing an invoice to be sent from the Farmer to the Retailer.
 * @param {org.perishable.SendInvoice} tx
 * @transaction
 */

async function sendInvoice(tx) {
  const invoice = tx.invoice_id;
  const order = tx.invoice_id.order_Id;

  if (invoice.Invoice_Status != "CREATED") {
    if (invoice.Invoice_Status == "SENT") {
      throw "The Invoice has already been sent to the Retailer!";
    }
    else {
      throw "The Invoice has not yet been Created!";
    }
  }

  if (order.Order_Status != "SENT") {
    throw "No Order has been requested!";
  }

  else {
    invoice.Invoice_Status = "SENT";
  }

  const factory = getFactory();
  const NS = "org.perishable";

  var event = factory.newEvent(NS, "InvoiceMade");
  emit(event);

  const InvoiceRegistry = await getAssetRegistry("org.perishable.Invoice");
  await InvoiceRegistry.update(invoice);
}
