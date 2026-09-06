// Script to initialize localStorage with all bundles from ALL-BUNDLES-COMPLETE.json
// Run this in browser console or include it in index.html

fetch('/ALL-BUNDLES-COMPLETE.json')
  .then(response => response.json())
  .then(bundles => {
    // Add missing fields for each bundle
    const completeBundles = bundles.map((bundle, index) => ({
      ...bundle,
      order: index + 1,
      showInGrid: true,
      cardImage: bundle.cardImage || 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&h=300&fit=crop&q=80',
      cardPrice: bundle.priceNew,
      parentBundleId: bundle.parentCategory.toLowerCase().replace(/\s+/g, '-'),
      modalTitle: bundle.cardTitle,
      servicesLabel: 'Includes',
      priceUnit: 'EGP',
      whyBoxText: `${bundle.cardTitle} combines premium treatments for optimal results.`,
      gallery: [],
      sliderBgImage: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=1200&h=600&fit=crop&q=80',
      sliderBgColor: 'bg-espresso',
      sliderOrder: bundle.showInSlider ? (index + 1) : 999
    }));

    // Save to localStorage
    localStorage.setItem('bundles', JSON.stringify(completeBundles));

    // Create parent bundles from categories
    const categories = [...new Set(bundles.map(b => b.parentCategory))];
    const parentBundles = categories.map((cat, index) => ({
      id: cat.toLowerCase().replace(/\s+/g, '-'),
      name: cat,
      description: `Premium ${cat.toLowerCase()} packages`,
      isActive: true,
      order: index + 1,
      icon: '✨'
    }));

    localStorage.setItem('parentBundles', JSON.stringify(parentBundles));

    console.log(`✅ Successfully loaded ${completeBundles.length} bundles and ${parentBundles.length} parent categories!`);
    console.log('🔄 Reloading page...');

    setTimeout(() => {
      window.location.reload();
    }, 1000);
  })
  .catch(error => {
    console.error('❌ Failed to load bundles:', error);
  });
