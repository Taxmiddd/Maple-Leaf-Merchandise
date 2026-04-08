"use client";

import React from "react";
import { 
  Page, 
  Text, 
  View, 
  Document, 
  StyleSheet, 
  Image, 
  Font 
} from "@react-pdf/renderer";

// Mock Register Font for better industrial look if needed.
// Font.register({ family: 'Outfit', src: '...' });

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
    color: "#1A1A1A"
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 2,
    borderBottomColor: "#FF0000",
    paddingBottom: 20,
    marginBottom: 30
  },
  companyInfo: {
    fontSize: 10,
    color: "#666"
  },
  companyName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 4
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "right",
    textTransform: "uppercase"
  },
  billingSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40
  },
  billTo: {
    fontSize: 10,
    color: "#666",
    textTransform: "uppercase",
    marginBottom: 8
  },
  clientInfo: {
    fontSize: 12,
    fontWeight: "bold"
  },
  table: {
    display: "flex",
    width: "auto",
    marginBottom: 40
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F0F0F0",
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
    padding: 8
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    padding: 8
  },
  colDesc: { width: "60%", fontSize: 10 },
  colQty: { width: "15%", fontSize: 10, textAlign: "center" },
  colPrice: { width: "25%", fontSize: 10, textAlign: "right" },
  totalSection: {
    alignItems: "flex-end"
  },
  totalRow: {
    flexDirection: "row",
    padding: 4
  },
  totalLabel: {
    fontSize: 10,
    color: "#666",
    width: 60
  },
  totalValue: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "right",
    width: 80
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    paddingTop: 10,
    fontSize: 8,
    color: "#AAA",
    textAlign: "center"
  }
});

export const InvoicePDF = ({ data }: { data: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.companyName}>MAPLE LEAF TRADING LTD.</Text>
          <Text style={styles.companyInfo}>123 Business Way, Vancouver, BC</Text>
          <Text style={styles.companyInfo}>Canada, V6B 1A1</Text>
          <Text style={styles.companyInfo}>T: +1 (604) 000-0000</Text>
        </View>
        <View>
          <Text style={styles.invoiceTitle}>INVOICE</Text>
          <Text style={[styles.companyInfo, { textAlign: "right" }]}>#{data.invoiceNumber}</Text>
          <Text style={[styles.companyInfo, { textAlign: "right" }]}>Date: {data.date}</Text>
        </View>
      </View>

      {/* Bill To */}
      <View style={styles.billingSection}>
        <View>
          <Text style={styles.billTo}>Bill To:</Text>
          <Text style={styles.clientInfo}>{data.clientName}</Text>
          {data.companyName && <Text style={styles.companyInfo}>{data.companyName}</Text>}
          <Text style={styles.companyInfo}>{data.email}</Text>
        </View>
        <View style={{ textAlign: "right" }}>
          <Text style={styles.billTo}>Payment Status:</Text>
          <Text style={[styles.clientInfo, { color: data.isPaid ? "#22C55E" : "#EF4444" }]}>
            {data.isPaid ? "PAID" : "PENDING"}
          </Text>
          <Text style={styles.companyInfo}>Method: {data.paymentMethod}</Text>
        </View>
      </View>

      {/* Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.colDesc}>DESCRIPTION</Text>
          <Text style={styles.colQty}>QTY</Text>
          <Text style={styles.colPrice}>AMOUNT</Text>
        </View>
        {data.items.map((item: any, i: number) => (
          <View key={i} style={styles.tableRow}>
            <Text style={styles.colDesc}>{item.description}</Text>
            <Text style={styles.colQty}>{item.quantity}</Text>
            <Text style={styles.colPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
          </View>
        ))}
      </View>

      {/* Totals */}
      <View style={styles.totalSection}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal</Text>
          <Text style={styles.totalValue}>${data.total.toFixed(2)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Tax (5%)</Text>
          <Text style={styles.totalValue}>${(data.total * 0.05).toFixed(2)}</Text>
        </View>
        <View style={[styles.totalRow, { marginTop: 10, borderTopWidth: 1, borderTopColor: "#1A1A1A" }]}>
          <Text style={[styles.totalLabel, { color: "#1A1A1A", fontWeight: "bold" }]}>TOTAL</Text>
          <Text style={[styles.totalValue, { fontSize: 16, color: "#FF0000" }]}>
            ${(data.total * 1.05).toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>Thank you for choosing Maple Leaf Trading Ltd. All B2B transactions are subject to our terms of trade.</Text>
        <Text>GST/HST: 123456789 RT0001</Text>
      </View>
    </Page>
  </Document>
);
