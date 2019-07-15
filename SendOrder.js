/**
 * A transaction processor function that Sends Orders made by Retailers to Farmers
 * @param {org.perishable.SendOrder} tx
 * @transaction
 */

async function sendOrder(tx) {
    const order = tx.order_id;

    if (order.Order_Status != "CREATED") {
        if (order.Order_Status == "SENT") {
            throw "The Order has already been sent!";
        }
        else {
            throw "The Order has not yet been Created!";
        }
    }

    else {
        order.Order_Status = "SENT";
    }

    const factory = getFactory();
    const NS = "org.perishable";

    var event = factory.newEvent(NS, "OrderMade");
    emit(event);

    const orderRegistry = await getAssetRegistry("org.perishable.Order");
    await orderRegistry.update(order);
}