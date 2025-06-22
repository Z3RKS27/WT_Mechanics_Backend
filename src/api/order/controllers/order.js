'use strict';
//@ts-ignore

const stripe = require("stripe")(process.env.STRIPE_KEY);
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order', ({ strapi }) => ({
  async create(ctx) {
    try {
      const { products } = ctx.request.body;

      if (!products || !Array.isArray(products)) {
        ctx.response.status = 400;
        return { error: "Missing or invalid 'products' array." };
      }

      const lineItems = await Promise.all(
        products.map(async (product) => {
          const response = await strapi.entityService.findMany("api::product.product", {
            filters: { productName: product.name },
            limit: 1,
          });

          const item = response?.[0];

          if (!item) {
            throw new Error(`Producto con nombre '${product.name}' no encontrado.`);
          }

          return {
            price_data: {
              currency: "mxn",
              product_data: {
                name: item.productName,
              },
              unit_amount: Math.round(item.price * 100),
            },
            quantity: 1,
          };
        })
      );

      const session = await stripe.checkout.sessions.create({
        shipping_address_collection: { allowed_countries: ["MX"] },
        payment_method_types: ["card"],
        mode: "payment",
        success_url: `${process.env.CLIENT_URL}/success`,
        cancel_url: `${process.env.CLIENT_URL}/canceled`,
        line_items: lineItems,
      });

      await strapi.service("api::order.order").create({
        data: { products, stripeId: session.id },
      });

      return { stripeSession: session };

    } catch (error) {
      console.error("Error al crear la orden:", error);
      ctx.response.status = 500;
      return { error: "Hubo un error al procesar la orden." };
    }
  },
}));
