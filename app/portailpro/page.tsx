'use client'
import { Globe, Lock, Box, Phone, CreditCard, X } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function PortailPro() {
  const [cguAccepted, setCguAccepted] = useState(false)
  const [showCGU, setShowCGU] = useState(false)
  const [showError, setShowError] = useState(false)

  // Empêcher le défilement du body quand le modal est ouvert
  useEffect(() => {
    if (showCGU) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [showCGU])

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

  const handlePayment = () => {
    if (!cguAccepted) {
      setShowError(true)
      return
    }
    // Ici vous pouvez ajouter la logique de paiement
    console.log('Lancement du paiement...')
  }

  // Custom Checkbox component
  const Checkbox = ({ checked, onChange, id, label }: { checked: boolean, onChange: (checked: boolean) => void, id: string, label: React.ReactNode }) => {
    return (
      <div className="flex items-center space-x-2">
        <div
          className={`w-4 h-4 border rounded cursor-pointer flex items-center justify-center
            ${checked ? 'bg-orange-500 border-orange-500' : 'border-gray-300'}`}
          onClick={() => onChange(!checked)}
        >
          {checked && (
            <svg className="w-3 h-3 text-white" viewBox="0 0 24 24">
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
        <label htmlFor={id} className="text-sm text-gray-600 cursor-pointer">
          {label}
        </label>
      </div>
    )
  }

  // Custom Alert component
  const Alert = ({ children }: { children: React.ReactNode }) => {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              {children}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Custom Modal component
  const Modal = ({ isOpen, onClose, children }: { isOpen: boolean, onClose: () => void, children: React.ReactNode }) => {
    if (!isOpen) return null

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all w-full max-w-3xl">
            {children}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50">
      <br /><br /><br /><br /><br /><br /><br /><br /><br />
      <main className="max-w-6xl mx-auto px-4 pb-16">
        {/* Features Section */}
        <div className="space-y-16">
          <div className="text-center space-y-4">
            <h3 className="text-4xl font-bold text-primary tracking-tight">
              Portail Pro
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Une solution complète pour les vignerons qui souhaitent développer leur présence en ligne, sans contraintes de logistique ni d&apos;engagement
            </p>
          </div>
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
        <div className="mt-24 max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl shadow-orange-100/50 overflow-hidden">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-8 text-center">
              <h3 className="text-2xl font-bold mb-2">Frais D&apos;inscription</h3>
              <div className="flex items-center justify-center">
                <span className="text-xl font-bold">240€</span>
                <span className="ml-2">ht</span>
              </div>
            </div>

            <div className="p-8 space-y-8">
              <div>
                <p className="font-semibold text-lg text-center text-orange-500 mb-6">
                  Sans Engagement
                </p>
                <ul className="space-y-4">
                  {pricingFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 text-orange-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CGU Checkbox */}
              <Checkbox
                id="cgu"
                checked={cguAccepted}
                onChange={(checked: boolean) => {
                  setCguAccepted(checked)
                  setShowError(false)
                }}
                label={
                  <>
                    J&apos;accepte les{' '}
                    <button
                      onClick={() => setShowCGU(true)}
                      className="text-orange-500 hover:underline"
                      type="button"
                    >
                      conditions générales d&apos;utilisation
                    </button>
                  </>
                }
              />

              {showError && (
                <Alert>
                  Veuillez accepter les conditions générales d&apos;utilisation avant de procéder au paiement.
                </Alert>
              )}

              <div className="space-y-4">
                <button
                  onClick={() => window.location.href = "tel:+33000000000"}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white w-full py-4 rounded-xl font-medium hover:shadow-lg hover:shadow-orange-200/50 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Phone className="w-5 h-5" />
                  <span>Nous Contacter</span>
                </button>

                <button
                  onClick={handlePayment}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white w-full py-4 rounded-xl font-medium hover:shadow-lg hover:shadow-green-200/50 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Procéder au paiement</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Custom Modal for CGU */}
      <Modal isOpen={showCGU} onClose={() => setShowCGU(false)}>
        <div className="relative">
          <div className="absolute right-0 top-0">
            <button
              onClick={() => setShowCGU(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-4">
            <h2 className="text-xl font-bold">CONDITIONS GÉNÉRALES D&apos;UTILISATION VENDEUR VIGNERONS.(ES)</h2>
          </div>

          <div className="max-h-96 overflow-y-auto pr-4">
            <div className="space-y-6">
              <div>
                <h4 className="font-bold mb-2">Il est exposé que :</h4>
                <p className="text-gray-600">
                  Vins.mémégeorgette.com est une plateforme de Biolibairterre SAS, société par actions simplifiée au
                  capital de 2500 euros, dont le siège social est situé à Saurel 33890 Coubeyrac immatriculée au registre
                  du commerce et des sociétés de Libourne sous le numéro 934 999 798 représentée par Monsieur
                  Charles Hannon, représentant légal dûment habilité (ci-après définie Biolibairterre SAS »,
                  conformément à la marque commerciale Mémé Georgette déposée par Charles Hannon).
                  Biolibairterre SAS exploite, depuis la France, des plateformes web sous forme de site internet de vente
                  en ligne, de site internet vitrine à destination des vignerons ou assimilés situés en France métropolitaine
                  et en Europe (ci-après les «Vignerons») avec notamment un site internet de vente en ligne exploité
                  par Biolibairterre SAS pour acheteurs particuliers par l&apos;intermédiaire d&apos;une vitrine public et pour les
                  professionnels via un accès privé, dont les conditions sont régies dans ce document Conditions
                  Générales d&apos;Utilisation Vendeur (ci-après les « CGU Vendeurs »)
                  Biolibairterre SAS met ainsi à la disposition des Vignerons des Services (ci-après les « Services »)
                  Les Vignerons peuvent proposer sur ces plateformes des prestations (ci-après les « Prestations ») ou
                  des produits (ci-après les « Produits ») à des clients particuliers et professionnels. Les Vignerons
                  peuvent proposer à la vente leurs Produits ou leurs Prestations et être ainsi présentés comme Vendeurs.
                  (ci-après les « Vendeurs »)
                  Il est rappelé que Biolibairterre SAS n&apos;est en aucun cas le producteur des Produits mis en ligne, seuls les
                  Vignerons qui mettent leurs produits vinicoles en vente sur le Site détiennent ce statut de producteur.
                  Il a été en conséquence convenu et arrêté ce qui suit :
                </p>
              </div>

              <div>
                <h4 className="font-bold mb-2">Article 1. Objet - Champ d&apos;application - Adhésion</h4>
                <p className="text-gray-600">
                  Les présentes Conditions Générales d&apos;Utilisation Vendeur (ci-après les « CGU Vendeur ») s&apos;appliquent en
                  complément des Conditions Générales de Ventes Particuliers et des Conditions Générales de Ventes
                  Professionnels accessibles à l&apos;adresse URL www.XXXXXXXXX/CGV/CGU et forment un tout. Les Vendeurs
                  acceptent de se soumettre à tout moment sans restriction ni réserve aux CGV des sites de Biolairtere
                  SAS
                  L&apos;objet de ces CGU Vendeur a pour but de définir les conditions dans lesquelles Biolibairterre SAS met à
                  la disposition des Vendeurs, des services leur facilitant l&apos;accès au e-commerce et leur permettant de
                  mettre en vente leurs Produits. Elles définissent également les conditions qui encadrent les différents
                  Services proposés par Biolibairterre SAS comme par exemple le référencement internet pour
                  promouvoir leur produits, de vente de Services logistiques, de services commerciaux ou tout autres
                  activités événementielles mais également des services inhérents à l&apos;utilisation du Site et qui permettent
                  l&apos;échange simple et direct avec les Utilisateurs par le biais de commentaires mais aussi de Services
                  divers que Biolibairterre SAS met à disposition des Vendeurs. Pour utiliser le Site et avoir accès aux
                  Services, le Vendeur accepte de se soumettre aux CGV et CGU Vendeur. Les CGU Vendeur sont
                  accessibles de manière automatique depuis URL www.XXXXXXXXX/CGV/CGU
                  <br />
                  Biolibairterre SAS se réserve la possibilité de modifier les CGU Vendeur à tout moment, puis d&apos;en
                  informer le vendeur. Les CGU et CGV applicables sont celles en vigueur au jour de la passation de la
                  commande par l&apos;Acheteur et sont acceptées par le Vendeur lors de chaque vente de Produits.
                </p>
              </div>

              <div>
                <h4 className="font-bold mb-2">Article 2. Services proposés par Biolibairterre SAS aux Vendeurs.</h4>
                <p className="text-gray-600">
                  2.1. Les services fournis par Biolibairterre SAS ont pour objet de permettre aux Vendeurs :
                  <br />
                  - de commercialiser leurs Produits au travers des services commerciaux
                  <br />
                  - mettre en vente des Produits sur les différentes plateformes Biolibairterre SAS
                  <br />
                  - de mettre en vente des Produits auprès des partenaires de Biolibairterre SAS
                  <br />
                  <br />
                  2.2. Le Site constitue également un lieu permettant l&apos;échange simple et direct avec les Utilisateurs,
                  notamment par le biais de commentaires (cf. Article 9 des CGV).
                  Biolibairterre SAS se réserve le droit d&apos;apporter au Site toutes les modifications et améliorations
                  nécessaires et ne pourra être tenu responsable des dommages et conséquences pouvant survenir de
                  ce fait.
                  Biolibairterre SAS s&apos;engage à tout mettre en œuvre pour que le Site fonctionne de la manière la plus
                  optimale possible mais ne sera tenu à cet égard qu&apos;à une obligation de moyen. Biolibairterre SAS ne
                  sera pas responsable des conséquences résultant de l&apos;inaccessibilité du Site, pour quelque raison que
                  ce soit et, notamment, en raison de contraintes ou de difficultés d&apos;ordre technique ou de fiches produits
                  mal complétées par le vendeur.
                </p>
              </div>

              {/* Ajoutez d'autres sections des CGU selon vos besoins */}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={() => setShowCGU(false)}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Fermer
            </button>
            <button
              onClick={() => {
                setCguAccepted(true)
                setShowCGU(false)
              }}
              className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors"
            >
              Accepter
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
