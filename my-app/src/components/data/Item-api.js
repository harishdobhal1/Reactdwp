// item.js

const parseItem = (data) => {
    return {
        field1: data.field1 || '',
        field2: data.field2 || 0,
        field3: data.field3 || false,
        field4: data.field4 || '',
        field5: data.field5 || '',
        field6: data.field6 || 0,
        field7: data.field7 || 0,
        field8: data.field8 || '',
        field9: data.field9 || '',
        field10: data.field10 || 0,
        field11: data.field11 || '',
        field12: data.field12 || '',
        field13: data.field13 || 0,
        field14: data.field14 || '',
        field15: data.field15 || '',
        field16: data.field16 || '',
        field17: data.field17 || false,
        field18: data.field18 || 0,
        field19: data.field19 || '',
        field20: data.field20 || 0,
        field21: data.field21 || '',
        field22: data.field22 || '',
        field23: data.field23 || 0,
        field24: data.field24 || '',
        field25: data.field25 || '',
        field26: data.field26 || '',
        field27: data.field27 || '',
        field28: data.field28 || 0,
        field29: data.field29 || '',
        field30: data.field30 || 0
    };
};

const generateItems = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/excel');
        const jsonData = await response.json();
        if (!jsonData || !Array.isArray(jsonData)) return [];
        return jsonData.map(item => parseItem(item));
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};

export default generateItems;
