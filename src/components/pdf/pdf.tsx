import React from 'react';
import wcag from 'wcag-as-json/src/wcag.json';
import { Page, Text, Font, Document, StyleSheet } from '@react-pdf/renderer';

Font.register({
  family: 'Raleway',
  src: 'http://fonts.gstatic.com/s/raleway/v11/2VvSZU2kb4DZwFfRM4fLQPesZW2xOQ-xsNqO47m55DA.ttf'
});
// Create styles
const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'Raleway'
  },
  author: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 18,
    margin: 12,
    fontFamily: 'Raleway'
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: 'justify',
    fontFamily: 'Raleway'
  },
  image: {
    marginVertical: 15,
    marginHorizontal: 100,
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center',
    color: 'grey',
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
});

const MyDocument = ( props: { values: { [s: string]: unknown; } | ArrayLike<unknown>; }) => {
  
  return (
    <Document>
      <Page size="A4" style={styles.body}>
        
        <Text style={styles.title}>Issues</Text>
          {Object.entries(props.values).map(([key, value]) => {
            return <Text key={key} style={styles.text}>{`${key}: ${value}`}</Text>
          })}
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
        `${pageNumber} / ${totalPages}`
      )} fixed /> 
      </Page>
    </Document>
  );
}

export default MyDocument;
