import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// PDF Styles
const styles = StyleSheet.create({
    page: { padding: 30, fontSize: 12, fontFamily: 'Helvetica' },
    header: { fontSize: 18, textAlign: 'center', marginBottom: 20, fontWeight: 'bold' },
    table: { width: '100%', borderCollapse: 'collapse', marginBottom: 20 },
    row: { flexDirection: 'row', borderBottom: '1px solid #000', padding: 5 },
    col: { width: '25%', textAlign: 'center' },
    footer: { textAlign: 'right', marginTop: 10, fontSize: 14, fontWeight: 'bold' },
    companyDetails: { textAlign: 'center', marginBottom: 10 },
    signature: { marginTop: 20, textAlign: 'right', fontSize: 12 }
  });
  
  const BillPDF = ({ cart, totalPrice, today, companyName }) => (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>{companyName}</Text>
        <Text style={styles.companyDetails}>{`${import.meta.env.VITE_ADDRESS}`}</Text>
        <Text style={styles.companyDetails}>{`${import.meta.env.VITE__MOBILE}`} | {`${import.meta.env.VITE_GST}`}</Text>
        <Text style={styles.header}>Invoice - {today}</Text>
        
        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={styles.col}>Item No</Text>
            <Text style={styles.col}>Product Name</Text>
            <Text style={styles.col}>Price</Text>
            <Text style={styles.col}>Qty</Text>
          </View>
          {cart.map((item, index) => (
            <View style={styles.row} key={index}>
              <Text style={styles.col}>{index + 1}</Text>
              <Text style={styles.col}>{item.productName}</Text>
              <Text style={styles.col}>₹{item.productPrice}</Text>
              <Text style={styles.col}>{item.productQuantity}</Text>
            </View>
          ))}
        </View>
        
        <Text style={styles.footer}>Total: ₹{totalPrice}</Text>
        <Text style={styles.signature}>Authorized Signature</Text>
      </Page>
    </Document>
  );
  
export default BillPDF;
