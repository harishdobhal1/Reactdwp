// Item.js
const generateRandomItem = () => {
    return {
        field1: Math.random() > 0.5 ? 'Value 1A' : 'Value 1B',
        field2: Math.floor(Math.random() * 100),
        field3: Math.random() > 0.5 ? true : false,
        field4: `Field 4 ${Math.floor(Math.random() * 10)}`,
        field5: Math.random() > 0.5 ? 'Option A' : 'Option B',
        field6: Math.floor(Math.random() * 1000),
        field7: Math.floor(Math.random() * 50),
        field8: Math.random() > 0.5 ? 'Active' : 'Inactive',
        field9: `Supplier ${Math.floor(Math.random() * 100)}`,
        field10: Math.floor(Math.random() * 1000),
        field11: `Location ${Math.floor(Math.random() * 10)}`,
        field12: Math.random() > 0.5 ? 'Type A' : 'Type B',
        field13: Math.floor(Math.random() * 10),
        field14: `Manufacturer ${Math.floor(Math.random() * 20)}`,
        field15: `${Math.floor(Math.random() * 10)}/2025`,
        field16: `Category ${Math.floor(Math.random() * 5)}`,
        field17: Math.random() > 0.5 ? true : false,
        field18: Math.floor(Math.random() * 100),
        field19: Math.random() > 0.5 ? 'Option C' : 'Option D',
        field20: Math.floor(Math.random() * 1000),
        field21: `Location ${Math.floor(Math.random() * 10)}`,
        field22: Math.random() > 0.5 ? 'Type C' : 'Type D',
        field23: Math.floor(Math.random() * 10),
        field24: `Manufacturer ${Math.floor(Math.random() * 20)}`,
        field25: `${Math.floor(Math.random() * 10)}/2025`,
        field26: Math.random() > 0.5 ? 'Active' : 'Inactive',
        field27: `Supplier ${Math.floor(Math.random() * 100)}`,
        field28: Math.floor(Math.random() * 1000),
        field29: `Location ${Math.floor(Math.random() * 10)}`,
        field30: Math.floor(Math.random() * 50)
    };
};

const generateItems = (count) => {
    const items = [];
    for (let i = 0; i < count; i++) {
        items.push(generateRandomItem());
    }
    return items;
};

export default generateItems(30);
