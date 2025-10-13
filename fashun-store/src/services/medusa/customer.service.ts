import { medusaClient } from '@/lib/medusa-client';

export const MedusaCustomerService = {
  async create(data: { email: string; password: string; first_name: string; last_name: string }) {
    const { customer } = await medusaClient.customers.create(data);
    return customer;
  },

  async login(email: string, password: string) {
    const { customer } = await medusaClient.auth.authenticate({ email, password });
    return customer;
  },

  async retrieve() {
    const { customer } = await medusaClient.customers.retrieve();
    return customer;
  },

  async update(data: any) {
    const { customer } = await medusaClient.customers.update(data);
    return customer;
  },

  async addAddress(address: any) {
    const { customer } = await medusaClient.customers.addresses.addAddress({ address });
    return customer;
  },

  async updateAddress(addressId: string, address: any) {
    const { customer } = await medusaClient.customers.addresses.updateAddress(addressId, address);
    return customer;
  },

  async deleteAddress(addressId: string) {
    const { customer } = await medusaClient.customers.addresses.deleteAddress(addressId);
    return customer;
  },

  async listOrders() {
    const { orders } = await medusaClient.customers.listOrders();
    return orders;
  }
};
