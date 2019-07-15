/**
 * A transaction processor function that dispatches a shipment from the Farmer to the Retailer via the Transporter
 * @param {org.perishable.ReceiveShipment} tx
 * @transaction
 */

async function receiveShipment(tx) {
  const shipment = tx.shipment_id;
  const farmer = tx.farmer_id;
  const retailer = tx.retailer_id;
  const order = tx.order_id;
  const invoice = shipment.invoice_Id;
  const produce = invoice.produce_id;
  var revert = 0;
  var penaltyHigh = 0;
  var penaltyLow = 0;


  if (shipment.Arrival_datetime > order.Arrival_DateTime) {
    shipment.Shipment_Status = "INVALID";
    document.write(
      "The Shipment is Late as it has been delivered after the agreed upon date specified in the Order!"
    );
    document.write("The amount paid has been reverted to the Retailer!");
    revert = invoice.Quantity_Per_Box * invoice.Boxes * produce.Unit_Price;
    console.log(revert);
  } else {
    shipment.Shipment_Status = "RECEIVED";

    if (shipment.MaxShipTemp > order.MaxTemp) {
      penaltyHigh = order.PenaltyMultiplier * (shipment.MaxShipTemp - order.MaxTemp) * (invoice.Quantity_Per_Box * invoice.Boxes);

      console.log(penaltyHigh);
    }
    if (shipment.MinShipTemp < order.MinTemp) {
      penaltyLow = order.PenaltyMultiplier * (order.MinTemp - shipment.MinShipTemp) * (invoice.Quantity_Per_Box * invoice.Boxes);
      console.log(penaltyLow);
    }
  }

  revert = penaltyHigh + penaltyLow;
  console.log(revert);
  farmer.Account_Balance -= revert;
  retailer.Account_Balance += revert;

  const farmerRegistry = await getParticipantRegistry("org.perishable.Farmer");
  const retailerRegistry = await getParticipantRegistry(
    "org.perishable.Retailer"
  );
  const shipmentRegistry = await getAssetRegistry("org.perishable.Shipment");

  await farmerRegistry.update(farmer);
  await retailerRegistry.update(retailer);
  await shipmentRegistry.update(shipment);
}
