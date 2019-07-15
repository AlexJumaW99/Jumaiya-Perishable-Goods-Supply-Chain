/**
 * A transaction processor function that dispatches a shipment from the Farmer to the Retailer via the Transporter
 * @param {org.perishable.DispatchShipment} tx
 * @transaction
 */

async function dispatchShipment(tx) {
  const shipment = tx.shipment_id;
  const invoice = shipment.invoice_Id;
  const produce = invoice.produce_id;

  if (invoice.Invoice_Status == "SENT") {
    if (produce.Stock < invoice.Quantity_Per_Box * invoice.Boxes) {
      throw "There is not enough produce to supply the order!";
    } else {
      produce.Stock -= invoice.Quantity_Per_Box * invoice.Boxes;
    }
  } else {
    throw "You have not yet sent the Invoice!";
  }

  shipment.Shipment_Status = "IN_TRANSIT";


  const produceRegistry = await getAssetRegistry("org.perishable.Produce");
  await produceRegistry.update(produce);
  const shipmentRegistry = await getAssetRegistry("org.perishable.Shipment");
  await shipmentRegistry.update(shipment);
  const InvoiceRegistry = await getAssetRegistry("org.perishable.Invoice");
  await InvoiceRegistry.update(invoice);
}
