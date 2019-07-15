/**
 * A transaction processor function that Receives an Order and allows a Farmer to Accept Or Reject it
 * @param {org.perishable.ReceiveOrder} tx
 * @transaction
 */

async function receiveOrder(tx) {
    const order = tx.order_id;
    console.log(order);

    if (tx.FeedBack == "ACCEPTED") {
        order.FeedBack = "ACCEPTED";
        console.log(2 + 3);
    }
    else if (tx.FeedBack == "REJECTED") {
        order.FeedBack = "REJECTED";
        console.log(2 + 4);
    }
    else {
        console.log(2 + 5);
        throw "Invalid Input for the FeedBack!";
    }
    console.log(order.FeedBack);

    const factory = getFactory();
    const NS = "org.perishable";

    const orderRegistry = getAssetRegistry(NS + ".Order");
    orderRegistry.update(order);

    var event = factory.newEvent(NS, "OrderVerdict");
    emit(event);

}