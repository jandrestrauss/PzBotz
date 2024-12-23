async function handleSaveData(data) {
  try {
    const result = await window.api.saveData(data);
    if (result.success) {
      console.log('Data saved successfully');
    } else {
      console.error('Failed to save data:', result.error);
    }
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

async function handleLoadData() {
  try {
    const result = await window.api.loadData();
    if (result.success) {
      return result.data;
    } else {
      console.error('Failed to load data:', result.error);
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

// Example usage
document.getElementById('saveButton').addEventListener('click', () => {
  const data = { key: 'value' }; // Replace with actual data
  handleSaveData(data);
});

document.getElementById('loadButton').addEventListener('click', async () => {
  const data = await handleLoadData();
  console.log('Loaded data:', data);
});
