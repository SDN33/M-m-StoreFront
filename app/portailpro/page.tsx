'use client'
import { Globe, Lock, Box, Phone } from 'lucide-react'

export default function PortailPro() {
  const features = [
    {
      icon: <Globe className="w-8 h-8 text-orange-500" />,
      title: "Votre espace vigneron en ligne",
      description: "Gérez votre espace professionnel en quelques clics. Vendez vos vins bio en Europe avec notre support marketing intégré.",
      bgColor: "bg-gradient-to-br from-orange-50 to-orange-100"
    },
    {
      icon: <Lock className="w-8 h-8 text-orange-500" />,
      title: "Liberté totale",
      description: "Aucun engagement de durée ou de quantité. Fixez vos propres prix de vente directement depuis votre domaine.",
      bgColor: "bg-gradient-to-br from-orange-50 to-orange-100"
    },
    {
      icon: <Box className="w-8 h-8 text-orange-500" />,
      title: "Logistique simplifiée",
      description: "Nous prenons en charge toute la logistique. Préparez vos commandes dans des emballages agréés et déposez-les au centre le plus proche.",
      bgColor: "bg-gradient-to-br from-orange-50 to-orange-100"
    }
  ]

  const pricingFeatures = [
    "Gestion simplifiée depuis votre tableau de bord",
    "Logistique prise en charge par nos équipes",
    "Support client dédié",
    "Accès à notre réseau de distribution"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50">
      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
      <main className="max-w-6xl mx-auto px-4 pt-32 pb-16">
        {/* Features Section */}
        <div className="space-y-16">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-primary tracking-tight">
              Portail Pro
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Une solution complète pour les vignerons qui souhaitent développer leur présence en ligne, sans contraintes de logistique ni d&apos;engagement
            </p>
          </div>
          <br /><br />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`${feature.bgColor} p-8 rounded-2xl shadow-lg shadow-orange-100/50 hover:shadow-xl hover:shadow-orange-200/50 transition-all duration-300`}
              >
                <div className="space-y-6">
                  <div className="bg-white w-16 h-16 rounded-xl flex items-center justify-center shadow-sm mx-auto">
                    {feature.icon}
                  </div>
                  <h4 className="font-bold text-xl text-gray-800 text-center">{feature.title}</h4>
                  <p className="text-gray-600 leading-relaxed text-center">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Section */}
        <div
          className="mt-24 max-w-2xl mx-auto"
        >
          <div className="bg-white rounded-3xl shadow-xl shadow-orange-100/50 overflow-hidden">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-8 text-center">
              <h3 className="text-2xl font-bold mb-2">Frais D&apos;inscription</h3>
              <div className="flex items-center justify-center">
                <span className="text-xl font-bold text-primary">240€</span>
                <span className="text-primary ml-2">ht</span>
              </div>
            </div>

            <div className="p-8 space-y-8">
              <div>
                <p className="font-semibold text-lg text-center text-orange-500 mb-6">
                  Sans Engagement
                </p>
                <ul className="space-y-4">
                  {pricingFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600 text-center">
                      <svg className="w-5 h-5 text-orange-500 text-center mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white w-full py-4 rounded-xl font-medium hover:shadow-lg hover:shadow-orange-200/50 transition-all duration-300 flex items-center justify-center space-x-2">
                <Phone className="w-5 h-5" />
                <span>Nous Contacter</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
