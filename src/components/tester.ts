import fetchDataFromFirebase from './fireData';

const testFetch = async (): Promise<void> => {
  try {
    const data = await fetchDataFromFirebase();
    console.log('Test Result:', data);
  } catch (error) {
    console.error('Test Error:', (error as Error).message);
  }
};

testFetch();