const regions = {
    EMRO: ['AFG', 'IRQ', 'LBY', 'PSE', 'SOM', 'SYR', 'WSYR', 'YEM', 'SDN'],
    SEARO: ['COX', 'MMR'],
    AFRO: ['BFA', 'BDI', 'CMR', 'CAF', 'TCD', 'COD', 'ETH', 'MLI', 'MOZ', 'NER', 'NGA', 'SSD', 'ZWE'],
    AMRO: ['COL', 'HND', 'VEN'],
    EURO: ['CBNSYR', 'CBNTK', 'UKR'],
};

export const ccpmGetRegion = (countryCode) => {
    Object.keys(regions).forEach(reg => {
        if(regions[reg].find(ctry => ctry === countryCode)) return reg;
    })
    return '';
}