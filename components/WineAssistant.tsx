import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Définition des interfaces
interface Product {
  id: number;
  name: string;
  price: number;
  sale_price: number;
  regular_price: number;
  categories: { id: number; name: string }[];
  certification?: 'bio' | 'biodynamie' | 'en conversion';
  images: { src: string }[];
  store_name?: string;
  nom_chateau?: string;
  appellation?: string;
  millesime?: string;
  region__pays?: string;
  volume?: string;
  rating_count?: number;
  average_rating?: number;
  style?: 'charpenté' | 'fruité' | 'moelleux' | 'corsé' | 'sec';
  cepages?: string[];
  short_description?: string;
  description?: string;
  rating?: number;
  vendor: number;
  sans_sulfites_?: 'oui' | 'non';
  tags?: string[];
  accord_mets?: string[];
  degustation?: string;
}

// Constantes pour les mappings et configurations
const MOOD_MAP = {
  'romantique': {

    types: ['rouge', 'petillant'],
    scoreBoost: 3,
    description: 'Vins élégants et sensuels'
  },
  'festif': {
    priceCondition: (price: number) => price > 12,
    types: ['pétillant', 'blanc', 'rosé','liquoreux','autres'],
    scoreBoost: 3,
    description: 'Vins légers et joyeux'
  },
  'décontracté': {
    styleCondition: (style: string) => style === 'fruité' || style === 'moelleux',
    types: ['rosé', 'blanc'],
    scoreBoost: 2,
    description: 'Vins faciles et agréables'
  },
  'sérieux': {
    styleCondition: (style: string) => style === 'charpenté' || style === 'corsé',
    types: ['rouge'],
    scoreBoost: 3,
    description: 'Vins complexes et profonds'
  }
};

const OCCASION_MAP = {
  'dîner': {
    tags: ['gastronomie', 'repas', 'diner', 'dégustation'],
    priceCondition: (price: number, product: Product) => {
      return product.description?.toLowerCase().includes('gastronomie') ||
             product.description?.toLowerCase().includes('repas') ||
             product.description?.toLowerCase().includes('diner') ||
             product.description?.toLowerCase().includes('dégustation');
    },
    scoreBoost: 4,
    description: 'Vins accordés avec des plats raffinés'
  },
  'apéritif': {
    tags: ['apéritif', 'apero', 'convivial'],
    priceCondition: (price: number, product: Product) => {
      return product.description?.toLowerCase().includes('apéritif') ||
             product.description?.toLowerCase().includes('apero') ||
             product.description?.toLowerCase().includes('convivial');
    },
    scoreBoost: 3,
    description: 'Vins légers et sociables'
  },
  'cadeau': {
    priceCondition: (price: number, product: Product) => {
      return price > 18 ||
             product.description?.toLowerCase().includes('prestige') ||
             product.description?.toLowerCase().includes('grand cru');
    },
    scoreBoost: 3,
    description: 'Vins prestigieux et mémorables'
  }
};

const FLAVOR_MAP = {
  'fruité': {
    types: ['rosé', 'blanc'],
    styleCondition: (style: string) => style === 'fruité',
    scoreBoost: 3,
    description: 'Vins aux notes fraîches et vives'
  },
  'complexe': {
    types: ['rouge'],
    styleCondition: (style: string) => style === 'charpenté' || style === 'corsé',
    scoreBoost: 4,
    description: 'Vins avec de nombreuses nuances'
  },
  'léger': {
    types: ['blanc', 'rosé'],
    scoreBoost: 2,
    description: 'Vins délicats et subtils'
  },
  'puissant': {
    types: ['rouge, liquoreux, blanc'],
    styleCondition: (style: string) => style === 'charpenté' || style === 'corsé',
    scoreBoost: 3,
    description: 'Vins intenses et structurés'
  }
};

const AIWineAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState<{
    mood?: keyof typeof MOOD_MAP;
    occasion?: keyof typeof OCCASION_MAP;
    flavor?: keyof typeof FLAVOR_MAP;
    budget?: number;
  }>({});
  const [filteredWines, setFilteredWines] = useState<(Product & { score: number; matchReasons: string[] })[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Méthode de filtrage intelligente et contextuelle
  const intelligentWineMatch = useMemo(() => {
    return (product: Product) => {
      let matchScore = 0;
      const matchReasons: string[] = [];

      // Matching mood
      if (preferences.mood) {
        const moodConfig = MOOD_MAP[preferences.mood];
        if (moodConfig.types.includes(product.categories[0].name)) {
          matchScore += moodConfig.scoreBoost;
          matchReasons.push(`Correspond à l'ambiance ${preferences.mood}: ${moodConfig.description}`);
        }
      }

      // Matching occasion
      if (preferences.occasion) {
        const occasionConfig = OCCASION_MAP[preferences.occasion];
        const occasionMatch =
          ('tags' in occasionConfig && occasionConfig.tags.some(tag => product.tags?.includes(tag))) ||
          ('priceCondition' in occasionConfig && occasionConfig.priceCondition(product.price, product));

        if (occasionMatch) {
          matchScore += occasionConfig.scoreBoost;
          matchReasons.push(`Idéal pour ${preferences.occasion}: ${occasionConfig.description}`);
        }
      }

      // Matching flavor
      if (preferences.flavor) {
        const flavorConfig = FLAVOR_MAP[preferences.flavor];
        if (flavorConfig.types.includes(product.categories[0].name)) {
          matchScore += flavorConfig.scoreBoost;
          matchReasons.push(`Profil gustatif ${preferences.flavor}: ${flavorConfig.description}`);
        }
      }

      // Budget matching avec scoring contextuel
      if (preferences.budget) {
        const budgetDiff = Math.abs(product.price - preferences.budget);
        if (budgetDiff <= 15) {
          matchScore += 3;
          matchReasons.push('Correspond précisément au budget');
        } else if (budgetDiff <= 25) {
          matchScore += 1;
          matchReasons.push('Proche du budget');
        }
      }

          // New matching criteria based on ACF fields

      // Certification matching
      if (product.certification) {
        matchScore += 1;
        matchReasons.push(`Certification: ${product.certification}`);
      }

      // Region/Country matching
      if (product.region__pays) {
        matchScore += 2;
        matchReasons.push(`Région: ${product.region__pays}`);
      }

      // Style matching
      if (product.style) {
        matchScore += 2;
        matchReasons.push(`Style: ${product.style}`);
      }

      // Cépages (Grape Varieties) - if we want to add advanced matching
      if (product.cepages && product.cepages.length > 0) {
        matchScore += 1;
        matchReasons.push('Composition de cépages intéressante');
      }

      // Potential Food Pairing Matching
      if (product.accord_mets && product.accord_mets.length > 0) {
        matchScore += 1;
        matchReasons.push('Accords mets-vins adaptés');
      }

      // Sans Sulfites - for health-conscious or organic preference
      if (product.sans_sulfites_ === 'oui') {
        matchScore += 1;
        matchReasons.push('Vin sans sulfites ajoutés');
      }

      // Temperature service hint
      if (product.degustation) {
        matchScore += 1;
        matchReasons.push(`À servir: ${product.degustation}`);
      }

      // Bonus pour caractéristiques supplémentaires
      if (product.region__pays) matchScore += 1;

      return {
        ...product,
        score: matchScore,
        matchReasons
      };
    };
  }, [preferences]);
  useEffect(() => {
    const storeWineCounts = new Map<string, number>();

    const scoredWines = products
      .map(intelligentWineMatch)
      .filter(product => product.score > 0)
      .filter(product => product.volume !== 'autres')
      .sort((a, b) => b.score - a.score)
      .filter(product => {
        const storeName = product.store_name || 'unknown';
        const count = storeWineCounts.get(storeName) || 0;
        if (count >= 2) return false;
        storeWineCounts.set(storeName, count + 1);
        return true;
      })
      .slice(0, 5);

    setFilteredWines(scoredWines);
  }, [preferences, products, intelligentWineMatch]);

  // Méthodes de rendu et de navigation
  const renderMoodStep = () => (
    <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/40 rounded-lg hidden xl:block">
      <div>
        <p className="text-teal-800 text-xs text-center mb-4">
          Laissez vous guider par notre assistant virtuel pour trouver le vin parfait pour votre soirée.
        </p>
      </div>
      <h3 className="text-2xl font-bold mb-4">Votre humeur du moment ?</h3>
      <div className="grid grid-cols-2 gap-3">
        {Object.keys(MOOD_MAP).map((mood) => (
          <button
            key={mood}
            onClick={() => {
              setPreferences(prev => ({ ...prev, mood: mood as keyof typeof MOOD_MAP }));
              setStep(2);
            }}
            className="bg-white border-2 border-purple-200 hover:border-primary/40 text-primary font-semibold py-3 rounded-lg transition transform hover:scale-105 hover:shadow-md"
          >
            {mood.charAt(0).toUpperCase() + mood.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );

  const renderOccasionStep = () => (
    <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg">
      <h3 className="text-2xl font-bold mb-4">Pour quelle occasion ?</h3>
      <div className="grid grid-cols-2 gap-3">
        {Object.keys(OCCASION_MAP).map((occasion) => (
          <button
            key={occasion}
            onClick={() => {
              setPreferences(prev => ({ ...prev, occasion: occasion as keyof typeof OCCASION_MAP }));
              setStep(3);
            }}
            className="bg-white border-2 border-pink-200 hover:border-red-500 text-red-700 font-semibold py-3 rounded-lg transition transform hover:scale-105 hover:shadow-md"
          >
            {occasion.charAt(0).toUpperCase() + occasion.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );

  const renderFlavorStep = () => (
    <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
      <h3 className="text-2xl font-bold text-green-800 mb-4">Quel profil gustatif ?</h3>
      <div className="grid grid-cols-2 gap-3">
        {Object.keys(FLAVOR_MAP).map((flavor) => (
          <button
            key={flavor}
            onClick={() => {
              setPreferences(prev => ({ ...prev, flavor: flavor as keyof typeof FLAVOR_MAP }));
              setStep(4);
            }}
            className="bg-white border-2 border-green-200 hover:border-green-500 text-green-700 font-semibold py-3 rounded-lg transition transform hover:scale-105 hover:shadow-md"
          >
            {flavor.charAt(0).toUpperCase() + flavor.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );

  const renderBudgetStep = () => (
    <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
      <h3 className="text-2xl font-bold text-blue-800 mb-4">Votre budget</h3>
      <div className="space-y-4">
        <input
          type="range"
          min="10"
          max="100"
          step="5"
          className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
          onChange={(e) => setPreferences(prev => ({
            ...prev,
            budget: parseInt(e.target.value)
          }))}
        />
        <div className="flex justify-between text-sm text-blue-600">
          <span>10€</span>
          <span>100€</span>
        </div>
        <div className="text-center text-blue-800 font-semibold">
          Budget choisi: {preferences.budget ? `${preferences.budget}€` : 'Non défini'}
        </div>
        <button
          onClick={() => setStep(5)}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Découvrir mes vins
        </button>
      </div>
    </div>
  );

  const renderResultsStep = () => (
    <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/40 rounded-lg h-fit-content">
      <h3 className="text-2xl font-bold mb-4">Nos recommandations</h3>
      {filteredWines.length > 0 ? (
        <div className="space-y-4">
          {filteredWines.map((wine) => (
            <div
              key={wine.id}
              className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4 hover:shadow-xl transition cursor-pointer"
            >
            <Link href={`/produits/${wine.id}`} passHref>
              <div
                key={wine.id}
                className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4 hover:shadow-xl transition cursor-pointer"
              >

                <a>
                  <Image
                    src={wine.images[0].src}
                    alt={wine.name}
                    className="w-24 h-24 object-cover rounded-lg"
                    width={96}
                    height={96}
                  />
                </a>
              </div>
            </Link>


              <div className="flex-1">
                <h4 className="font-bold text-lg text-teal-800">{wine.name}</h4>
                <p className="text-gray-600">{wine.categories[0].name} | {wine.price}€</p>
                <div className="text-sm text-gray-500 mt-1">
                  {wine.matchReasons?.map((reason, index) => (
                    <div key={index} className="flex items-center">
                      <span className="text-green-600 mr-2">✓</span>
                      {reason}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">Aucun vin ne correspond à vos critères</p>
      )}
      <button
        onClick={() => setStep(1)}
        className="mt-4 w-full bg-black text-white py-3 rounded-lg hover:scale-105 transition"
      >
        Recommencer
      </button>
    </div>
  );

  const renderCurrentStep = () => {
    switch (step) {
      case 1: return renderMoodStep();
      case 2: return renderOccasionStep();
      case 3: return renderFlavorStep();
      case 4: return renderBudgetStep();
      case 5: return renderResultsStep();
      default: return null;
    }
  };

  return (
    <div className={`fixed bottom-24 right-4 z-50 transition-all duration-300 rounded-full ${
      isOpen ? 'w-96' : 'w-16'
    }`}>
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-black text-white flex justify-center items-center">
          <button
              onClick={() => setIsOpen(!isOpen)}
              className="hover:scale-110 p-2 transition-colors"
            >
            <h2 className="text-lg font-bold flex items-center">
              {isOpen && "L'assistant de Mémé"}
                <span className="text-xl text-center bg-transparent rounded-full p-2">AI</span>
            </h2>
              {isOpen ? '×' : ''}
          </button>
        </div>
        {isOpen && (
          <div className="p-4 max-h-[80vh] overflow-y-auto">
            <div className="space-y-4">
              {renderCurrentStep()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIWineAssistant;
