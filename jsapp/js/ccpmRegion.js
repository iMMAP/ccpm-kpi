const regions = {
    EMRO: ['AFG', 'IRQ', 'LBY', 'PSE', 'SOM', 'SYRD', 'SYRW', 'YEM', 'SDN'],
    SEARO: ['COX', 'MMR'],
    AFRO: ['BFA', 'BDI', 'CMR', 'CAF', 'TCD', 'COD', 'ETH', 'MLI', 'MOZ', 'NER', 'NGA', 'SSD', 'ZWE'],
    AMRO: ['COL', 'HND', 'VEN'],
    EURO: ['SYRCB', 'TURCB', 'UKR'],
    WPRO: ['ROP'],
};

export const ccpmGetRegion = (countryCode) => {
    Object.keys(regions).forEach(reg => {
        if(regions[reg].find(ctry => ctry === countryCode)) return reg;
    })
    return '';
}
