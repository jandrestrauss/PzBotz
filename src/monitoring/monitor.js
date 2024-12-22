// ...existing code...

const monitorAdvancedMetrics = () => {
  setInterval(async () => {
    const cpuUsage = await getCPUUsage();
    const memoryUsage = await getMemoryUsage();
    const diskIO = await getDiskIO();
    if (cpuUsage > 80) {
      alertAdmin('High CPU usage detected');
    }
  }, 60000); // Run every minute
};

monitorAdvancedMetrics();
