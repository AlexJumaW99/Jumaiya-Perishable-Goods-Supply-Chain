/**
 * A transaction processor function that will send money to the farmer based on the verdict
 * @param {org.perishable.InvoiceReceived} tx
 * @transaction
 */

async function invoiceReceived(tx) {
  const farmer = tx.farmer_id;
  const retailer = tx.retailer_id;
  const invoice = tx.invoice_id;
  const produce = tx.produce_id;

  const factory = getFactory();
  const NS = "org.perishable";

  console.log(invoice.Quantity_Per_Box);
  console.log(invoice.Boxes);
  console.log(produce.Unit_Price);

  if (tx.verdict == "ACCEPT") {
    var payout = invoice.Quantity_Per_Box * invoice.Boxes * produce.Unit_Price;
    console.log(payout);

    farmer.Account_Balance += payout;
    retailer.Account_Balance -= payout;
  }

  else if (tx.verdict == "DECLINE") {
    console.log("You have declined the Invoice!");
  }

  const farmerRegistry = await getParticipantRegistry("org.perishable.Farmer");
  await farmerRegistry.update(farmer);

  const retailerRegistry = await getParticipantRegistry(
    "org.perishable.Retailer"
  );
  await retailerRegistry.update(retailer);

  const produceRegistry = await getAssetRegistry("org.perishable.Produce");
  await produceRegistry.update(produce);

  var event = factory.newEvent(NS, "invoiceReceived");
  emit(event);
}
