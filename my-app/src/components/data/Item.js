// Item.js
const generateRandomItem = () => {
    return {
        field1: Math.random() > 0.5 ? 'kitchen roll holder' : 'SAMLA box 39x28x14 cm/11 l transparent',
        field2: Math.floor()>0.5? '40102978':'90530745',
        field3: Math.random() > 0.5 ? 'Act' : 'Req',
        field4: ` ${Math.floor(Math.random() * 10)}-${Math.floor(Math.random() * 10)}`,
        field5: Math.random() > 0.5 ? 'AA-2087909-2' : 'AA-2300274-4',
        field6: Math.random()>0.5? '2023-04-17':'2023-11-27',
        field7: Math.random()>0.5? '14139 - HANPLAST SP. Z O.O.':'10442 - SLG Kunststoff GmbH',
        field8: Math.random()>0.5? '2023-04-17':'2023-11-27',
        field9: Math.random()>0.5? '2023-04-17':'2023-11-27',
        field10: Math.random() > 0.5 ? '18-Home organisation' : '18-Home organisation15-Eating',
        field11: Math.random() > 0.5 ? '1811-Boxes and baskets' : 'Napkins',
        field12: Math.random() > 0.5 ? 'Plastic products' : 'Dairy Products',
        field13: Math.random() > 0.5 ? 'Segment:Injection moulding big products':'Segment:Injection moulding big products',
        field14:  Math.random() > 0.5 ? 'Yes' : 'No',
        field15: Math.random() > 0.5 ? 'Yes' : 'No',
        field16: Math.random() > 0.5 ? 'Saleable' : 'Saleable',
        field17: Math.random() > 0.5 ? 'Yes' : 'No',
        field18: Math.random() > 0.5 ? 'Actual' : 'Required',
        field19: `${Math.floor(Math.random() * 10)}`,
        field20: `${Math.floor(Math.random() * 10)}`,
        field21: Math.random() > 0.5 ? 'Submitted' : 'Rejected',
        field22: Math.random() > 0.5 ? 'Prashant Wakade' : 'Ramanathan',
        field23: Math.random() > 0.5 ? 'comments':'comments',
        field24:  Math.random() > 0.5 ? 'Centrally fulfilled,Store fulfilled' : 'Centrally fulfilled,Store fulfilled',
        field25:  Math.random() > 0.5 ? 'CP':'UL',
        field33: Math.random() > 0.5 ? 'Yes':'No',
        field34: Math.random() > 0.5 ? '90':'80',
        field26: Math.random() > 0.5 ? '999':'220',
        field27: Math.random() > 0.5 ? '365':'280',
        field28: Math.random() > 0.5 ? 'NFR (Normal Fire Risk)':'Fire Class:NFR (Normal Fire Risk)',
        field29: Math.random() > 0.5 ? 'Not Suitable for Filling or Tilting':'Suitable for Filling or Tilting',
        field30: Math.random() > 0.5 ? 'RTS collapse':'Not RTS collapse',
        field31: Math.random() > 0.5 ? '1.627':'2.627',
        field32: Math.random() > 0.5 ? '1.751':'1.751',
       
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
