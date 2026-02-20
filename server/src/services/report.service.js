const PDFDocument = require('pdfkit');

/**
 * Generate a report from scenario result
 * @param {Object} scenario
 * @param {Object} result
 * @param {string} format 'json' or 'pdf'
 * @returns {Promise<Object>} { buffer, contentType, extension }
 */
const generateReport = async (scenario, result, format) => {
    const summary = {
        projectName: scenario.project_id.city_name,
        scenarioId: scenario._id,
        status: scenario.status,
        parameters: {
            num_buses: scenario.num_buses,
            operating_hours: scenario.operating_hours,
            avg_speed: scenario.avg_speed
        },
        metrics: result.metrics || {},
        coverage_percent: result.coverage_percent
    };

    if (format === 'pdf') {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument();
                let buffers = [];
                doc.on('data', buffers.push.bind(buffers));
                doc.on('end', () => {
                    const pdfData = Buffer.concat(buffers);
                    resolve({
                        buffer: pdfData,
                        contentType: 'application/pdf',
                        extension: 'pdf'
                    });
                });

                doc.fontSize(20).text('Smart Transit AI - Optimization Report', { align: 'center' });
                doc.moveDown();

                doc.fontSize(14).text(`Project: ${summary.projectName || 'N/A'}`);
                doc.text(`Scenario ID: ${summary.scenarioId}`);
                doc.text(`Status: ${summary.status}`);
                doc.moveDown();

                doc.fontSize(16).text('Input Parameters');
                doc.fontSize(12).text(`Number of Buses: ${summary.parameters.num_buses}`);
                doc.text(`Operating Hours: ${summary.parameters.operating_hours}`);
                doc.text(`Average Speed: ${summary.parameters.avg_speed} km/h`);
                doc.moveDown();

                doc.fontSize(16).text('Optimization Results');
                if (summary.metrics) {
                    Object.entries(summary.metrics).forEach(([key, value]) => {
                        if (typeof value !== 'object') {
                            doc.fontSize(12).text(`${key}: ${value}`);
                        }
                    });
                }
                doc.fontSize(12).text(`Estimated Coverage: ${summary.coverage_percent || 0}%`);

                doc.end();
            } catch (error) {
                reject(error);
            }
        });
    }

    return {
        buffer: Buffer.from(JSON.stringify(summary, null, 2)),
        contentType: 'application/json',
        extension: 'json'
    };
};

module.exports = {
    generateReport
};
