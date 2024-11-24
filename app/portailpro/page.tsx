'use client'
import { Globe, Lock, Box, CreditCard, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

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
    },
    {
      icon: <Lock className="w-8 h-8 text-orange-500" />,
      title: "Liberté totale",
      description: "Aucun engagement de durée ou de quantité. Fixez vos propres prix de vente directement depuis votre domaine.",
    },
    {
      icon: <Box className="w-8 h-8 text-orange-500" />,
      title: "Logistique simplifiée",
      description: "Nous prenons en charge toute la logistique. Préparez vos commandes dans des emballages agréés et déposez-les au centre le plus proche.",
    }
  ]

  const handlePayment = async () => {
    if (!cguAccepted) {
      setShowError(true);
      return;
    }

    const stripe = await stripePromise;
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
    });

    const session = await response.json();

    if (session.id) {
      stripe?.redirectToCheckout({ sessionId: session.id });
    } else {
      console.error("Erreur lors de la création de la session de paiement.");
    }
  };


  const pricingFeatures = [
    "Gestion simplifiée depuis votre tableau de bord",
    "Logistique prise en charge par nos équipes",
    "Support client dédié",
    "Accès à notre réseau de distribution"
  ]


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
    <div className="min-h-screen">
      <br /><br /><br /><br /><br /><br /><br />
      <main className="max-w-6xl mx-auto px-4 pb-16 ">
        {/* Background SVG */}
        <svg
          className="absolute top-0 left-0 w-full h-full opacity-10 -z-10"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="#FF9800"
            fillOpacity="0.3"
            d="M0,160L48,176C96,192,192,224,288,218.7C384,213,480,171,576,170.7C672,171,768,213,864,229.3C960,245,1056,235,1152,213.3C1248,192,1344,160,1392,144L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          ></path>
        </svg>
        {/* Features Section */}
        <div>
          <div className="text-center space-y-4 mb-8">
            {/* Suppression de l'image comme élément distinct */}
            <h3
              className="text-7xl tracking-tight font-bold relative bg-cover bg-center text-white flex items-center justify-center rounded-t-xl"
              style={{
              backgroundImage: 'url(/images/vins_fruitees.webp)', // Image en arrière-plan
              backgroundSize: 'cover', // Couvrir toute la zone
              backgroundPosition: 'center', // Centrer l'image
              backgroundBlendMode: 'multiply', // Mélange de couleurs
              height: '300px', // Augmenter la hauteur de l'image
              }}
            >
              PORTAIL PRO
            </h3>
            <p className="font-bold text-lg mx-auto">
              Une solution e-commerce complète pour les vignerons bio <br /> restez concentré sur votre production, nous nous occupons du reste
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`p-8 rounded-2xl shadow-lg shadow-black-100/50 hover:shadow-xl hover:shadow-primary-200/50 transition-all duration-300`}
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
          <p className="font-bold text-xl text-center mx-auto mt-20 -mb-4 slide-in-right">
              Rejoignez notre réseau de vignerons et vendez vos vins bio en Europe,<br /> déverrouillez votre potentiel de vente dès aujourd&apos;hui sans contraintes de logistique ni d&apos;engagement.
          </p>
        </div>

        {/* Pricing Section */}
        <div className="mt-24 max-w-2xl mx-auto slide-in-right">
          <div className="bg-white rounded-3xl shadow-xl shadow-teal-100/50 overflow-hidden">
            <div className="bg-primary text-white p-8 text-center">
              <h3 className="text-2xl font-bold mb-2">Frais D&apos;inscription</h3>
              <div className="flex items-center justify-center">
                <span className="text-3xl font-bold">240€</span>
                <span className="ml-1 text-sm"><em>hors taxe</em></span>
              </div>
            </div>

            <div className="p-8 space-y-8">
              <div>
                <p className="font-semibold text-lg text-center text-primary mb-6">
                  Sans Engagement
                </p>
                <ul className="space-y-4 text-center mx-auto">
                  {pricingFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center text-black text-center">
                      <svg className="w-5 h-5 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

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
                      className="text-primary hover:underline"
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
                  onClick={() => window.location.href = "/contact"}
                  className="bg-primary text-white w-full py-4 rounded-xl font-medium hover:shadow-lg hover:bg-orange-900 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>Nous Contacter</span>
                </button>

                <button
                  onClick={handlePayment}
                  className="bg-teal-800 text-white w-full py-4 rounded-xl font-medium hover:shadow-lg hover:bg-teal-950 transition-all duration-300 flex items-center justify-center space-x-2"
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
                  Vinsmemegeorgette.com est une plateforme de Biolibairterre SAS, société par actions simplifiée au
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
              <div>
              <h4 className="font-bold mb-2">Article 3. Inscriptions sur le Site</h4>
              <p className="text-gray-600">
                Conformément à l&apos;Article 8.1 des CGV, pour bénéficier du Site et de ses Services, le Vendeur doit
                souscrire à un Compte Utilisateur selon le formulaire de candidature en ligne sur le Site et garantir être
                un professionnel.
                L&apos;inscription du Vendeur et la création de son compte (ci-après “Espace Vigneron”) se font au moyen
                d&apos;un formulaire de candidature accessible sur le site https://lXXXXXXXXXXXX.
                Un seul compte peut être attribué par Vendeur (même SIRET) et associé à une même adresse
                électronique.
                La création du Compte Utilisateur permettra notamment au Vendeur d&apos;échanger de manière simple et
                directe avec les Utilisateurs du Site et de ses Services.
                <br /><br />
                La procédure d&apos;inscription via le formulaire en ligne comprend les étapes suivantes :
                <br /><br />
                1) Le Vendeur complète un formulaire de candidature afin de fournir les informations nécessaires dont
                toutes sont qualifiées d&apos;impératives. Les informations sont d&apos;ordre personnelles : nom, adresse, moyens
                de contact et d&apos;ordre professionnelle : appellations, services recherchés. Le Vendeur prend
                connaissance et accepte les présentes conditions générales avant de valider son formulaire de
                candidature et prend également connaissance des conditions de paiement et du système de
                facturation l&apos;obligeant à déposer ses factures dans son espace client selon la procédure présentée à
                l&apos;Art.7.2
                <br /><br />
                2) Le comité de sélection de la société Biolibairterre SAS s&apos;assure de l&apos;intérêt et de la pertinence de la
                candidature du Vigneron. Avant de recevoir un lien pour la création de son Espace Vigneron, le
                Vigneron s&apos;acquitte des frais d&apos;inscriptions de 240€ HT, payable en ligne en un seul règlement
                <br /><br />
                3) Le Vendeur valide alors son profil Vigneron en accédant à la rédaction des champs obligatoires de
                son profil, de ses informations sur son domaine et de ses fiches produits. Il s&apos;oblige à mentionner le prix
                de ses Produits ainsi que le cadre d&apos;exécution géographique de ces derniers dans l&apos;espace vigneron.

                Le tarif des Produits affiché sur les Sites correspond au meilleur tarif disponible pour un Produit
                équivalent au Vendeur concerné, aucun tarif plus avantageux ne pouvant être obtenu par un
                Acheteur particulier directement auprès du Vendeur ou par l&apos;intermédiaire d&apos;un autre tiers, d&apos;un autre
                moyen ou par une autre source.
                <br /><br />
                4) Les informations sont réputées exactes et seront mises à jour régulièrement, le Vendeur est
                responsable de l&apos;exactitude et l&apos;actualisation de son profil sur son Espace Vigneron. La validité des
                ses certificats biologiques et biodynamique mis en ligne, sont de sa responsabilité.
                <br /><br />
                5) Il est strictement interdit de créer un compte sans qu&apos;il n&apos;ait pour objet de la collaboration avec
                Biolibairterre SAS, d&apos;y stipuler des informations inexactes ou de s&apos;attribuer des certifications sans en
                avoir reçu les documents officiels et qui devront être fournis lors de la saisie des fiches techniques
                des Produits
                <br /><br />
                6) Une fois son compte créé et dûment complété, le Vendeur est publié et devient visible en ligne
                quand les activités ou les Produits ont été entièrement rédigés et validés par Biolibairterre SAS. Le
                Vendeur peut alors commencer à recevoir ses commandes. Une commande validée par le Vendeur
                l&apos;engage de manière irrévocable. Biolibairterre SAS se réserve toutefois le droit de refuser une
                commande d&apos;un Acheteur, pour toute demande anormale, réalisée de mauvaise foi ou pour tout
                motif légitime.
                <br /><br />
                7) Il est précisé qu&apos;une page de présentation du Vendeur peut être créée et maintenue en
                attendant qu&apos;un Produit soit vendu.
              </p>
              </div>
              <div>
              <h4 className="font-bold mb-2">Article 4. Conditions de vente des Produits et des Services</h4>
                <p className="text-gray-600">
                  4.1. Bonne foi et respect de la législation applicable
                  <br /><br />
                  Pour accéder aux Services du Site, le Vendeur s&apos;engage à mettre en œuvre, de bonne foi, tous les
                  moyens nécessaires afin de remplir ses obligations en délivrant un service de qualité aux Acheteurs. Il
                  s&apos;engage notamment pour cela à répondre aux courriers électroniques provenant de Biolibairterre SAS
                  dans un délai de quarante-huit (48) heures à compter de leur réception.
                  Le Vendeur s&apos;identifiera auprès des Utilisateurs comme agissant en qualité de professionnel. Le Vendeur
                  respectera la législation applicable en matière d&apos;exercice d&apos;une activité commerciale : autorisation
                  gouvernementale, immatriculation, obligations comptables, sociales, fiscales, douanières, etc.
                  Le Vendeur respectera la législation applicable relative à la vente de boissons alcooliques et plus
                  généralement eu égard aux Produits qu&apos;il vend sur le Site. Les Produits qui seront présentés sur le Site
                  par le Vendeur s&apos;entendront Congés et Droits acquittés et porteront obligatoirement les capsules
                  Mariannes françaises (CRD) selon le cadre légal français. Les règles de présence ou non des Mariannes
                  CRD pourront faire l&apos;objet d&apos;ajustement selon le pays de commercialisation final. Le Vendeur s&apos;engage
                  et garantit qu&apos;il ne vendra que des Produits dont il est propriétaire ou sur lesquels il a des droits. Le
                  Vendeur garantit que les Produits ne contreviennent en aucune façon aux lois, réglementations en
                  vigueur et normes applicables et qu&apos;ils ne portent pas atteinte aux droits de tiers.
                  Biolibairterre SAS ne pourra donc être tenue responsable si le contenu des Produits ou des
                  Prestations vendus est défaillant ou impropre à la consommation.
                  <br /><br />
                  4.2. Obligations relatives aux offres de Produits sur le Site
                  <br /><br />
                  4.2.a Obligations légales du Vendeur
                  Le Vendeur s&apos;engage à respecter toutes les obligations légales de mise en vente des Produits et des
                  Prestations. En ce sens, il s&apos;assure notamment que les étiquettes des bouteilles présentent les mentions
                  légales imposées par la législation du pays dans lequel la bouteille est vendue. Il est de la
                  responsabilité du Vendeur de s&apos;assurer de la conformité de ses bouteilles ou Produits aux obligations
                  légales. Dans ce cadre, Biolibairterre SAS ne pourra être tenue pour responsable d&apos;un quelconque
                  manquement à ce sujet.
                  Conformément à l&#39;article 100 de la loi d&#39;orientation des mobilités, la mesure n°11 du Comité
                  interministériel de la sécurité routière (CISR) du 9 janvier 2018, vise à lutter contre la conduite sous
                  l&#39;emprise de l&#39;alcool en incitant les usagers de la route à l&#39;auto-évaluation de leur taux d&#39;alcool. Les sites
                  de vente en ligne de boissons alcoolisées devront obligatoirement proposer à la vente des éthylotests.
                  4.2.b Contenus et Droits
                  Pour chaque Produit ou Prestation vendus par le biais du Site, le Vendeur aura complété en amont la
                  Fiche Vigneron et la Fiche Produit via son espace personnel sur le Site. Le Vendeur s&apos;engage donc à
                  communiquer aux Acheteurs toutes les informations leur permettant de connaître les caractéristiques
                  essentielles du Produit et de la Prestation. De fait, il incombe au Vendeur de mettre à jour régulièrement
                  les informations renseignées.
                  Dans ce cadre, Biolibairterre SAS décline toute responsabilité quant à l&apos;exactitude des informations
                  renseignées par le Vendeur sur le Site.
                  Les illustrations/visuels téléchargés sur le Site pour la Fiche Produits devront être conformes aux
                  Produits ainsi illustrés et respecteront les droits des tiers, notamment ceux de propriété intellectuelle.
                  Ainsi, Biolibairterre SAS ne pourra en aucun cas être tenu responsable d&apos;une violation des droits des tiers
                  concernant des visuels fournis par les Vendeurs.
                  Le Vendeur s&apos;assure que les photos, documents et informations fournies respectent les droits d&apos;auteurs
                  ou sont libres de droits. Ils fournissent les autorisations nécessaires à l&apos;utilisation des contenus restreints,
                  crédits photos et tout autre support que Biolibairterre SAS serait amené à publier sur son Site.
                  Le Vendeur atteste et garantit à Biolibairterre SAS que pour la durée de validité du présent Accord :
                  Le Vendeur possède tous les droits, pouvoirs et autorités nécessaires pour utiliser, accorder une (sous)
                  licence et permettre à Biolibairterre SAS de rendre disponible, sur les Sites, les Droits de Propriété
                  Intellectuelle qui concernent les Informations Vendeur disponibles sur les Sites, ou qui sont établis ou
                  évoqués dans celles-ci.
                  4.2.c Contenus textuels
                  En ce qui concerne les Œuvres écrites et d&apos;image, le Vendeur garantit à BIOLIBAIRTERRE SAS l&apos;autorisation
                  préalable et expresse de lui conférer l&apos;usage de leurs droits patrimoniaux sur ces œuvres pour les
                  besoins, la durée et sur le territoire du présent Contrat.
                  Le Vendeur reste propriétaire et confère un droit d&apos;usage, de reproduction et d&apos;exploitation temporaire à
                  BIOLIBAIRTERRE SAS, pour la durée et sur le territoire prévus au présent Contrat, tous droits d&apos;exploitation,
                  de reproduction, de représentation et d&apos;usage du contenu textuel du site Internet de la Plateforme
                  BIOLIBAIRTERRE SAS relatif aux Fiches Produits, à savoir notamment les textes de présentation des
                  produits offerts à la vente et les observations des Vignerons (ci-après collectivement désignées les «
                  Œuvres écrites »).
                  Les droits d&apos;usage des Contenus textuels conférés par le Vendeur à BIOLIBAIRTERRE SAS comprennent :
                  Le droit de reproduction, c&apos;est-à-dire le droit de reproduire ou de faire reproduire les Œuvres écrites, par
                  tous moyens techniques, sur les sites Internet exploités par BIOLIBAIRTERRE SAS ainsi que sur tous
                  supports de réseaux sociaux et commerciaux à destination exclusive de ses clients et/ou membres.
                  Le droit de représentation, c&apos;est-à-dire le droit de communiquer au public (dans leur langue d&apos;origine et
                  dans les traductions qui pourront être effectuées) les Œuvres écrites sur les sites Internet exploités par
                  <br /><br />
                  BIOLIBAIRTERRE SAS ainsi que sur tous supports de réseaux sociaux et commerciaux à destination
                  exclusive de ses clients et/ou membres.
                  Le droit d&apos;adaptation, c&apos;est-à-dire le droit d&apos;appliquer aux Œuvres écrites des agencements rendus
                  nécessaires par des contraintes techniques ou commerciales liées à leur utilisation ou reproduction,
                  sans pour autant les dénaturer ou porter atteinte à leurs caractéristiques essentielles. Le Vendeur
                  accepte expressément que les Œuvres écrites puissent faire l&apos;objet d&apos;une mise à jour par BIOLIBAIRTERRE
                  SAS, à la condition que ces mises à jour ne les dénaturent pas.
                  Le droit de traduire, c&apos;est-à-dire le droit de faire traduire tout ou partie des Œuvres écrites en toutes
                  langues.
                  <br /><br />
                  4.2.d Contenus visuels
                  <br /><br />
                  Le Vendeur cède à Biolibairterre SAS et à ses partenaires et/ou pour les besoins des sites qu&apos;il exploite et
                  réseaux sociaux, pour la durée et sur le territoire prévus au présent contrat, un droit d&apos;usage pour la
                  reproduction, représentation, et exploitation des images relatifs aux Annonces du site Internet de la
                  Plateforme BIOLIBAIRTERRE SAS, à savoir notamment les photographies des Produits offerts à la vente et
                  les photographies des Vignerons (ci-après collectivement désignées les « Œuvres photographiques »).
                  Les droits d&apos;usage conférés pour les contenus visuels par le Vendeur à BIOLIBAIRTERRE SAS comprennent
                  :
                   Le droit de reproduction, c&apos;est-à-dire le droit de reproduire ou de faire reproduire les Œuvres
                  photographiques, par tous moyens techniques, sur le site Internet de Biolibairterre SAS
                  accessible actuellement sur les sites Internet exploités par BIOLIBAIRTERRE SAS ainsi que sur tous
                  supports de réseaux sociaux et commerciaux à destination exclusive de ses clients et/ou
                  membres.
                   Le droit de représentation, c&apos;est-à-dire le droit de communiquer au public les Œuvres
                  photographiques sur le Site à l&apos;adresse www.lesgrappes.com et www.lesgrappes.com/pro,
                  ppour ses partenaires et sur tous supports commerciaux à destination exclusive de ses clients.
                   Le droit d&apos;adaptation, c&apos;est-à-dire le droit d&apos;appliquer aux Œuvres photographiques des
                  agencements rendus nécessaires par des contraintes techniques ou commerciales liées à leur
                  utilisation ou reproduction, sans pour autant les dénaturer ou porter atteinte à leurs
                  caractéristiques essentielles.
                  4.2.e Respect des règlements des Appellations
                  Le Vendeur s&apos;oblige pour tous les produits présents sur le Site à respecter strictement les règlements
                  d&apos;appellation à la lettre.
                  Il sera tenu pour responsable des infractions et manquements aux réglementations aux :
                  Articles 45 et 55 du règlement d&apos;exécution N°2019/33 complétant le règlement (UE) n°1308/2013 en ce
                  qui concerne les demandes de protections des appellation d&apos;origine, des indications géographiques et
                  des mentions traditionnelles dans le secteur vitivinicole, la procédure d&apos;opposition, les restrictions
                  d&apos;utilisation, les modifications des cahiers des charges, l&apos;annulation de la protection, l&apos;étiquetage et la
                  présentation - Mention de terme indiquant une aire géographique pour des vins ne bénéficiant pas
                  d&apos;une indication ou d&apos;une appellation géographique;
                  Article L.121-2 du code de la consommation - Pratique commerciale trompeuse
                  L&apos;article 55 du réglement d&apos;exécution n° 2019/33 stipule :
                  “1. Conformément à l&apos;article 120, paragraphe 1, point g), du règlement (UE) n°1308/2013, et sans préjudice
                  des articles 45 et 46, seul un produit de la vigne bénéficiant d&apos;une appellation d&apos;origine protégée, d&apos;une
                  indication géographique protégée ou d&apos;une indication géographique d&apos;un pays tiers peut comporter
                  sur son étiquette une référence au nom d&apos;une unité géographique qui est plus petite ou plus grande
                  que la zone de cette appellation d&apos;origine ou de cette indication géographique. »
                  Une référence à une appellation d&apos;origine protégée est réservée aux vins qui en bénéficient, tel que
                  dispose dans l&apos;article 103 du réglement (UE) n°1308/2013 :
                  “Article 103 - Protection
                  I. Une appellation d&apos;origine protégée et une indication géographique protégée peuvent etre utilisees par
                  tout opérateur commercialisant un vin produit conformément au cahier des charges correspondant.
                  2. Une appellation d&apos;origine protégée et une indication géographique protégée, ainsi que le vi qui fait
                  usage de cette dénomination protégée en respectant le cahier des charges correspondant, sont
                  protégés contre:
                  a) toute utilisation commerciale directe ou indirecte de cette dénomination protégée:
                  i) pour des produits comparables ne respectant pas le cahier des charges lie a la dénomination
                  protégée;
                  ii) dans la mesure où ladite utilisation exploite la réputation d&apos;une appellation d&apos;origine ou indication
                  géographique;
                  b) toute usurpation, imitation ou évocation, même si l&apos;origine véritable du produit ou du service est
                  indiquée ou si la dénomination protégée est traduite, transcrite, translittérée ou accompagnée d&apos;une
                  expression telle que «genre», «type», «méthode», «façon», «imitation», «gout», «manière» ou d&apos;une
                  “expression similaire; »
                  et article 119 du même règlement :
                  « Article 119- Indications obligatoires
                  1. L&apos;étiquetage et la présentation des produits visés a l&apos;annexe VII, partie II, points 1 a 11, 13, 15 et 16,
                  commercialisés dans l&apos;Union ou destinés à l&apos;exportation, comportent les indications obligatoires
                  suivantes:
                  a) la dénomination de la catégorie de produit de la vigne conformément à l&apos;annexe VII, partie II;
                  b) pour les vins bénéficiant d&apos;une appellation d&apos;origine protégée ou d&apos;une indication géographique
                  protégée:
                  i) les termes «appellation d&apos;origine protégée» ou «indication géographique protégée»; ainsi que
                  ii) la dénomination de l&apos;appellation d&apos;origine protégée ou de l&apos;indication geographique protegee,- ».
                  La référence à des communes ou à une région d&apos;appellation pourrait être induire le consommateur en
                  erreur et lui faire penser que ces produits sont effectivement des vins d&apos;appellation. Cela est constitutif
                  d&apos;une pratique commerciale trompeuse, au sens de l&apos;article L.121-2 du code de la consommation :
                  « 1 -Une pratique commerciale est trompeuse si elle est commise dans l&apos;une des circonstances
                  suivantes : (…)
                  2 - Lorsqu&apos;elle repose sur des allégations, indications ou présentations fausses ou de nature à induire
                  en erreur et portant sur l&apos;un ou plusieurs des éléments suivants : (…)
                  b) Les caractéristiques essentielles du bien ou du service, à savoir : ses qualités substantielles, sa
                  composition, ses accessoires, son origine, sa quantité, son mode et sa date de fabrication, les
                  conditions de son utilisation et son aptitude à l&apos;usage, ses propriétés et les résultats attendus de son
                  utilisation, ainsi que les résultats et les principales caractéristiques des tests et contrôles effectués sur le
                  bien ou le service (..)».
                  Les infractions à ces dispositions sont punies par Particle L.132-2 du code de la consommation par un
                  emprisonnement de deux ans et une amende de 300 000 euros selon l&apos;Inspecteur de la Concurrence,
                  de la Consommation et de la Répression des Fraudes.

                  4.3. Obligations relatives à la vente des Produits et des Prestations
                  a. La vente des Produits proposés par les Vendeurs sur le Site est conclue à la condition résolutoire que
                  le Produit, le Service ou la Prestation soit disponible.
                  b. Le Vendeur est informé sans délai par courrier électronique par Biolibairterre SAS lorsqu&apos;un Produit ou
                  une Prestation a fait l&apos;objet d&apos;une commande par un Acheteur.
                  Le Vendeur disposera d&apos;un délai de (24) heures ouvrables pour informer Biolibairterre SAS de la non
                  disponibilité d&apos;un ou des Produits/Prestations commandés.
                  En cas de disponibilité du ou des Produits, Services ou Prestations commandés ou dans le cas où le
                  Vendeur ne s&apos;est pas manifesté sur l&apos;indisponibilité du ou des Produits commandés, le Vendeur
                  s&apos;engagera à :
                  -préparer la commande et la remettre au Transporteur dans un délai de soixante-douze (72) heures
                  ouvrables
                  -à assurer la Prestation à la date demandée par le client
                  Le Vendeur consultera régulièrement, au moins une fois par jour ouvré, ses courriers électroniques reçus
                  à l&apos;adresse fournie à Biolibairterre SAS afin de connaître la liste des Produits commandés par les
                  Acheteurs, dont il doit confirmer la disponibilité dans le délai mentionné précédemment.
                  4.4. Obligations relatives à la livraison des Produits
                  Le Vendeur s&apos;engage à communiquer via le Site les informations les plus détaillées possibles quant au
                  lieu de ramassage des marchandises afin que le Transporteur puisse s&apos;y rendre facilement.
                  Le Vendeur doit lors de la préparation de la commande, insérer dans chaque colis, un bon de livraison.
                  Le Vendeur s&apos;engage à apporter tout le soin nécessaire à la mise sous pli des Produits commandés de
                  façon à éviter que les Produits ne soient endommagés durant le transport.
                  Le Vendeur prévoit de pouvoir apposer un code EAN sur ses bouteilles à la demande de Biolibairterre
                  SAS quand ses clients lui en font la demande et cela sans surcoût sur le Prix d&apos;Achat de Biolibairterre
                  SAS
                  Un emballage de qualité est essentiel pour garantir la sécurité de votre envoi durant son
                  acheminement. Utilisez toujours un carton ondulé, robuste et en bon état pour les colis. Pour les objets
                  fragiles ou lourds, l&apos;utilisation de carton double ou triple cannelure est fortement recommandée. Évitez
                  de réutiliser de vieilles boîtes car elles peuvent avoir perdu une partie de leur rigidité. Sélectionnez un
                  emballage approprié au poids de votre envoi. Évitez les emballages trop grands qui risquent d&apos;être
                  écrasés. Choisissez une boîte adaptée à la taille de son contenu. Ne dépassez jamais 30kg par carton.
                  Concernant le prestataire de livraison, deux cas sont à distinguer :
                  Pour les commandes inférieures à 24 bouteilles, la livraison sera assurée par DHL, partenaire logistique
                  de Biolibairterre SAS ;
                  Pour les commandes supérieures à 24 bouteilles et selon la localisation du Vendeur lors de son
                  inscription sur le Site, il devra assurer les livraisons par le biais de son transporteur privé ou recourir au
                  partenaire logistique de Biolibairterre SAS.
                  <br /><br />
                  4.4.1 Transport assuré par le Vendeur
                  Dans le cas où le Vendeur a recours à son propre Transporteur, le Vendeur aura la responsabilité
                  d&apos;acheminer les marchandises au Client.
                  Pour les commandes de plus de 24 bouteilles Biolibairterre SAS indemnisera le Vendeur au réel sur
                  preuve de facture du transporteur et jusqu&apos;à 1,2€ht maximum par bouteilles
                  Pour les commandes en dessous de 24 bouteilles, le devis de transport devra d&apos;abord être soumis à
                  Biolibairterre SAS pour validation avant expédition.

                  Dans le cas où survient une avarie durant l&apos;acheminement des Produits à l&apos;Acheteur, le Vigneron
                  recevra les directives de Biolibairterre SAS et ne traitera pas les réclamations des Acheteurs en direct et
                  préviendra Biolibairterre SAS sous 36 heures comme prévu à l&apos;Art.4.
                  <br /><br />
                  4.4.2 Transport au travers de la logistique Biolibairterre SAS
                  Dans le cas où Biolibairterre SAS pratique un enlèvement au lieu de livraison du Vendeur, il aura la
                  responsabilité d&apos;acheminer les marchandises au Client.
                  Dans le cas où survient une avarie durant l&apos;acheminement des Produits à l&apos;Acheteur, le Vendeur recevra
                  les directives de Biolibairterre SAS et ne traitera pas les réclamations des Acheteurs en direct et
                  préviendra Biolibairterre SAS sous 36 heures comme prévu à l&apos;Art.4. Afin de se prémunir de la casse le
                  Vendeur reconnaît avoir recours à des emballages de qualité et porte la responsabilité en cas d&apos;usage
                  d&apos;épaisseurs de cartons ne convenant pas au transport en messagerie au colis.
                  Dans le cas d&apos;une casse de produit durant le transport organisé par Biolibairterre SAS, si la casse est
                  caractérisée et reconnue par le transporteur, et si le client destinataire choisi d&apos;être re-livré des produits
                  initialement commandés plutôt que d&apos;obtenir un avoir, alors le Vendeur sera amené à relivrer les
                  Produits à l&apos;Acheteur. Il fournira dans les 48 heures du signalement de l&apos;avarie une facture des produits
                  cassés, à Biolibairterre SAS. Il sera remboursé à l&apos;issue du remboursement du transporteur à
                  Biolibairterre SAS du montant de la casse
                  Dans le cadre de l&apos;article 3, le Vendeur préviendra d&apos;une éventuelle absence qui pourrait compromettre
                  le traitement des commandes des Produits ou des Prestations. Le Vendeur sera tenu de renseigner son
                  absence sur son espace Vigneron ou à défaut de prévenir Biolibairterre SAS par mail.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-2">Article 5. Non Démarchage et non sollicitation</h4>
                <p className="text-gray-600">
                 Le Site proposant un service de mise en relation entre les Vendeurs et les Acheteurs, il revient à
                 Biolibairterre SAS d&apos;assurer le lien entre les Vendeurs et les Acheteurs. Dans ce cadre, il est formellement
                 interdit au Vendeur de contacter directement et/ou de s&apos;adresser directement à l&apos;Acheteur qu&apos;il soit
                 particulier ou professionnel, durant toute la durée du contrat et jusqu&apos;à trois (3) ans au-delà de sa date
                 de fin ou de rupture.
                 Dans le cas d&apos;une prise de contact directement à l&apos;initiative de l&apos;Acheteur, le Vendeur en informera
                 Biolibairterre SAS sous 36 heures et demandera à Biolibairterre SAS de prendre en charge les échanges
                 et résolution de toute demande de leur part. Biolibairterre SAS se chargera donc d&apos;assurer la totalité des
                 relations avec l&apos;Acheteur. En cas de non-respect de cette règle, Biolibairterre SAS se réserve le droit
                 d&apos;imposer le versement d&apos;une pénalité au Vendeur en conséquence.
                 Dans le cas d&apos;une Vente de Produits ou Services effectuée directement entre le Vendeur et l&apos;Acheteur en
                 dehors du cadre Biolibairterre SAS, des pénalités correspondant à un rapport de cinq fois (5 fois) la
                 somme vendue sera demandée par Biolibairterre SAS. Si le montant n&apos;était pas connu de Biolibairterre
                 SAS, une somme forfaitaire de 4500 euros Hors Taxes sera demandée par Biolibairterre SAS au Vendeur.
                 Cette pénalité sera due de plein droit et à réception d&apos;une mise en demeure et sans préjudice de tous
                 dommages et intérêts que Biolibairterre SAS pourrait solliciter en réparation de son préjudice.
                 Dans le cas d&apos;un nouveau client auprès duquel le Vendeur passerait en direct lors d&apos;une phase de
                 prospection avérée ou de réponse à un Appel d&apos;Offre de Biolibairterre SAS, une pénalité forfaitaire de
                 7000€ Hors Taxes sera demandée en réparation de la perte estimée par Biolibairterre SAS ou un
                 montant indexé sur le montant sur le montant de la première commande. La preuve du montant de la
                 commande sera à la charge du Vendeur.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-2">Article 6. Prix de vente</h4>
                <p className="text-gray-600">
                  6.1. Durée de validité des Prix
                  <br /><br />
                  Compte tenu des engagements pris par Biolibairterre SAS avec ses différents acheteurs, les prix de
                  vente entre le Vendeur et Biolibairterre SAS s&apos;entendent fixés du 1er Mars au 28 février de l&apos;année
                  suivante.
                  <br /><br />
                  6.2. Responsabilité des Prix proposés
                  <br /><br />
                  Les prix sont inscrits sous l&apos;entière responsabilité du Vendeur dans l&apos;Espace Vigneron. Une fois les grilles
                  de prix publiées dans l&apos;espace vigneron dans le menu “Grille de Prix”, le Vendeur a 48h pour faire la
                  vérification et les recours nécessaires pour le changement de prix erronés si tel était le cas. Au-delà de
                  ce délai, le Prix est réputé validé, publié et accepté par les deux parties et valable pour une année.
                  Si le Vendeur souhaite modifier le Prix Vendeur pour un ou plusieurs de ses Produits, ce dernier devra en
                  informer Biolibairterre SAS qui exécutera alors la modification des prix directement sur l&apos;Espace
                  Vigneron du Site.
                  <br /><br />
                  6.3. Fixation des prix de revente
                  <br /><br />
                  Biolibairterre SAS est libre de fixer son prix de revente. A ce titre Biolibairterre SAS peut choisir d&apos;accepter
                  le changement du Prix Vendeur du Produit qu&apos;il achète mais ne pas appliquer la modification au prix de
                  revente qu&apos;elle pratique sur le Site.
                  Il est également convenu avec le Vendeur que certaines négociations tarifaires donneront lieu à la
                  création de grilles tarifaires définies par leur période d&apos;application et leur prix fixé sur cette dite période.
                  Une augmentation annuelle par exemple ne peut modifier le prix convenu entre Biolibairterre SAS et le
                  Vendeur sur la période accordée. Par défaut, tout accord tarifaire pour un client, sera convenu pour une
                  année à la date de création de la grille spécifique.
                  Dans le cas d&apos;un Particuliers qui vient à effectuer un achat égal ou supérieur à 24 bouteilles chez le
                  même Vendeur, Biolibairterre SAS sollicitera alors un prix d&apos;achat correspondant au prix d&apos;achat
                  convenu lors d&apos;une vente à un Caviste. En effet, ces commandes de Particuliers pour un nombre de
                  bouteilles égal ou supérieur à 24 bouteilles sont réputées, dans la classification Biolibairterre SAS, être
                  un achat d&apos;un client caviste et à ce titre Biolibairterre SAS bénéficie d&apos;un prix d&apos;achat correspondant.
                  Biolibairterre SAS pratiquera toutefois un prix de revente au client en corrélation avec son prix de vente
                  habituel pour un Particuliers.
                  <br /><br />
                  6.4. Réservations et allocations particulières
                  <br /><br />
                  Les réservations de volumes consenties par le Vendeur s&apos;entendent pour une période donnée ou par
                  défaut par une Année. Si le vigneron consent un volume à Biolibairterre SAS et à ses clients, il convient
                  qu&apos;il respecte cet engagement afin que les clients Biolibairterre SAS puissent être approvisionnés selon
                  les stocks renseignés et au prix convenu pour cette réservation.
                  Toute modification des prix et de stocks des réservation devra être expressément communiqué à
                  Biolibairterre SAS pour un arbitrage à l&apos;amiable et selon un délai de 1 mois pour sa mise en application.
                  En cas de défaut du Vendeur quand à la disponibilité des réservations ou en cas de changement des
                  prix sur la période consentie, le Vendeur assumera les recours financiers éventuels demandés par le
                  client et Biolibairterre SAS.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-2">Article 7. Modalités de paiement pour les Produits et facturation</h4>
                <p className="text-gray-600">
                  7.1. Acceptation des commandes
                  <br /><br />
                  L&apos;ensemble des données relatives à chaque commande, soit les quantités, l&apos;identité et la localisation
                  géographique du client, les références à expédier sont également présentes sur le bon de commande.
                  Les prix sont préalablement fixés cf article 6.
                  En cliquant dans son Espace Vigneron sur “préparer la commande”, le Vendeur accepte tous les
                  paramètres relatifs à la facturation de cette commande : prix, quantités, type de client, zone de
                  commercialisation, conditions de transport et conditions de livraison.
                  En cas de refus, il est tenu de manifester son désaccord sur ces paramètres avant traitement de la
                  commande. <br />
                  Les prix de vente appliqués par Biolibairterre SAS à l&apos;Acheteur étant établis sur la base des prix affichés
                  sur l&apos;Espace Vigneron ou sur devis le cas échéants sont retransmis à nouveaux au Vendeur lors
                  passage de la commande. Si celui-ci valide la commande, il en accepte les conditions et le prix.
                  Aucune réclamation sur les prix d&apos;Achat consentis au moment de la commande ne seront recevable.
                  En cas d&apos;erreur imputable au Vendeur dans la préparation de la commande, le Vendeur supporte seul
                  les coûts entraînés par la décision de l&apos;Acheteur de se faire rembourser en renvoyant les produits. Dans
                  le cas de l&apos;erreur d&apos;un Produit pour un autre, le Vendeur est tenu de faire parvenir le produit commandé
                  par l&apos;Acheteur. Il peut demander à Biolibairterre SAS de demander à l&apos;Acheteur de retourner les produits
                  erronés avant d&apos;expédier à nouveau les Produits commandés. En cas de réclamation et de demande
                  d&apos;indemnisation par le client une somme forfaitaire prévue à l&apos;Article 10. Responsabilité sera demandée
                  au Vendeur et transmise à l&apos;Acheteur pour réparation du préjudice subi par l&apos;Acheteur.
                  <br /><br />
                  7.2. Modalités de Facturation
                  <br /><br />
                  Le Vendeur est tenu d&apos;établir une facturation mensuelle pour l&apos;ensemble des ventes expédiées au cours
                  du mois précédent. L&apos;ensemble des commandes honorées par le vendeur aux prix et quantités
                  préalablement acceptés par le vendeur conformément à l&apos;art. 7.2 seront listées sur une proforma
                  établie et transmise au vigneron à chaque début de mois.
                  Le Vendeur est ensuite tenu de téléverser sa facture sur l&apos;interface BIOLIBAIRTERRE SAS.
                  Toute facture implique une analyse, acceptation ou refus de la part de la société BIOLIBAIRTERRE SAS.
                  En cas d&apos;acceptation, le règlement est effectué par la société BIOLIBAIRTERRE SAS aux échéances
                  mentionnées dans l&apos;article 7.3. L&apos;avancement du traitement de la facture par BIOLIBAIRTERRE SAS est
                  affiché sur l&apos;espace personnel du vendeur.
                  En cas de refus de la facture pour non correspondance avec la proforma, le vendeur est notifié du refus
                  avec le motif du refus associé. Le Vendeur doit établir une nouvelle facture correspondant à la
                  proforma sachant que les paramètres ont été préalablement acceptés lors du traitement de la
                  commande.
                  En cas d&apos;erreur ou de différence de montant entre le règlement et la ou les factures, de difficultés de
                  lettrage de l&apos;opération, ou pour toute autre question relative à la dette de Biolibairterre SAS envers le
                  vendeur, le Vendeur est tenu de communiquer clairement l&apos;objet de désaccord ou questionnement sur
                  la boîte mail compta@biolibertaire.com
                  <br /><br />
                  7.3. Délai de règlement
                  <br /><br />
                  BIOLIBAIRTERRE SAS paie le Vendeur à 30 jours fin de mois.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-2">Article 8. Données personnelles</h4>
                <p className="text-gray-600">
                  Conformément à l&apos;article 10 des CGV, les informations et données relatives à toute personne physique
                  représentant les Vendeurs sont traitées par Biolibairterre SAS ; elles sont indispensables à la gestion de
                  la relation avec le Vendeur et de son accès au Site et à ses Services. Ces informations et données sont
                  également conservées à des fins de sécurité, afin de respecter les obligations légales et réglementaires
                  incombant, le cas échéant, à Biolibairterre SAS.
                  Le Vendeur s&apos;engage à utiliser les données personnelles de l&apos;Acheteur qui lui seront transmises par
                  Biolibairterre SAS uniquement pour les besoins de la livraison des Produits et pour lui permettre de
                  s&apos;acquitter des obligations légales qui s&apos;y attachent. Toute autre utilisation, location, vente, revente ou
                  copie de la part du Vendeur sont prohibées.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-2">Article 9. Promotion et marketing en ligne</h4>
                <p className="text-gray-600">
                  9.1. Promotion des Produits
                  <br /><br />
                  Biolibairterre SAS est autorisé à promouvoir le Vendeur en employant le ou les noms dudit Vendeur
                  dans le cadre de campagnes de marketing en ligne, y compris lors de campagnes par email et/ou de
                  publicité dite payée-par-clic (PPC). Biolibairterre SAS lance des campagnes de marketing et de
                  communication en ligne à ses propres frais et à sa seule discrétion.
                  <br /><br />
                  9.2. Méthodes utilisées
                  <br /><br />
                  Le Vendeur est réputé informé des méthodes de fonctionnement des moteurs de recherche, telles que
                  l&apos;indexation du contenu et le classement des URL. S&apos;il est porté à la connaissance du Vendeur que le
                  comportement de Sites Tiers viole les Droits de Propriété Intellectuelle dudit Vendeur, Biolibairterre SAS
                  accepte que le Vendeur l&apos;informe par écrit des détails dudit comportement. Biolibairterre SAS emploiera
                  des méthodes commercialement raisonnables et éthiques pour s&apos;assurer que le Tiers concerné prenne
                  les mesures appropriées pour remédier au non-respect des droits du Vendeur.
                  <br /><br />
                  9.3. Responsabilité
                  <br /><br />
                  Le Vendeur accepte de ne pas cibler spécifiquement la marque vinsmemegeorgette.com par le biais
                  d&apos;achats de mots clefs qui sont soumis aux Droits de Propriété Intellectuelle de Biolibairterre SAS.
                  9.4. Utilisation des logos et communication
                  Biolibairterre SAS pourra utiliser la marque ou le logo appartenant au Vendeur afin de promouvoir
                  l&apos;utilisation par le Vendeur du Site et de ses Services.
                  Il est entendu que les parties pourront communiquer sur l&apos;existence de leur partenariat sous réserve de
                  l&apos;accord préalable des parties quant au libellé du communiqué de presse.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-2">Article 10. Responsabilité</h4>
                <p className="text-gray-600">
                  Le Vendeur garantit et indemnisera Biolibairterre SAS contre tout dommage subi par Biolibairterre SAS
                  et contre toute action en responsabilité qui serait engagée à l&apos;encontre de Biolibairterre SAS à raison de
                  la violation par le Vendeur d&apos;un droit quelconque d&apos;un tiers, y compris d&apos;un Acheteur, que ce dommage
                  résulte de la vente de Produits, de l&apos;utilisation faite par le Vendeur des services du Site, ou de toute autre
                  fait qui lui serait imputable.
                  La responsabilité de Biolibairterre SAS envers le Vendeur ne peut être engagée que pour des faits qui lui
                  seraient directement imputables et est en tout état de cause limitée au montant correspondant aux
                  commandes réalisées dans le mois précédent. Elle ne peut être engagée pour les préjudices indirects,
                  notamment la perte de chance de vendre des Produits en cas d&apos;indisponibilité des Services du Site.
                  Biolibairterre SAS décline toute responsabilité en ce qui concerne les ventes conclues par l&apos;intermédiaire
                  du Site et de ses Services. Toute réclamation relative aux Produits qui serait portée à la connaissance
                  de Biolibairterre SAS sera transmise au Vendeur concerné, qui en assumera l&apos;entière et seule
                  responsabilité, ceci inclut les coûts de rappel, de retour et de dédommagement du client.
                  En complément, si la réclamation est justifiée et qu&apos;elle est de la responsabilité du Vendeur, elle
                  donnera lieu à une compensation financière de 15€ sous forme de bon d&apos;achat à l&apos;Acheteur, le Vendeur
                  sera facturé de cette même somme par Biolibairterre SAS.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-2">Article 11. Nullité partielle</h4>
                <p className="text-gray-600">
                  Toute clause des CGU Vendeur qui viendrait à être déclarée nulle en application d&apos;une loi, d&apos;un
                  règlement ou d&apos;une décision définitive d&apos;une juridiction compétente sera privée d&apos;effet, mais sa nullité
                  ne saurait porter atteinte aux autres stipulations ni affecter la validité des CGU Vendeur.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-2">Article 12. Différends et litiges avec les Acheteurs</h4>
                <p className="text-gray-600">
                  Dans l&apos;intérêt de la défense des Acheteurs du Site et de son image de marque, Biolibairterre SAS se
                  réserve le droit d&apos;intervenir auprès du Vendeur pour la résolution de tout litige.
                  Les litiges sont directement réglés entre l&apos;Acheteur et Biolibairterre SAS. Biolibairterre SAS se réserve
                  toutefois le droit de consulter le Vendeur qui s&apos;engage à lui répondre au plus tard dans un délai de
                  trente-six (36) heures ouvrables à compter de la réclamation de l&apos;Acheteur.
                  Le Vendeur fera ses meilleurs efforts pour aider Biolibairterre SAS à la résolution du différend/litige qui
                  l&apos;oppose à l&apos;Acheteur et fera ses meilleurs efforts pour parvenir à la résolution amiable du
                  différend/litige.
                  Biolibairterre SAS n&apos;interviendra pas dans le processus de retour des Produits, quelle que soit la cause
                  du retour. En conséquence, les Produits seront retournés directement à l&apos;adresse de retour du Vendeur
                  indiquée sur le Site ; Biolibairterre SAS ne réceptionne pas les retours de Produits. Dans l&apos;hypothèse où
                  un Produit serait retourné à Biolibairterre SAS, celle-ci renverrait le Produit au Vendeur à aux frais du
                  Vendeur.
                  Le Vendeur accepte que Biolibairterre SAS conserve tout paiement à verser au Vendeur jusqu&apos;à ce que
                  la réclamation ait été indiquée comme réglée par le Vendeur et par l&apos;Acheteur.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-2">Article 13. Cas de force majeure</h4>
                <p className="text-gray-600">
                  Un cas de force majeure la responsabilité de Biolibairterre SAS ne pourra pas être mise en oeuvre si la
                  non-exécution ou le retard dans l&apos;exécution de l&apos;une de ses obligations décrites dans les présentes
                  conditions générales de vente découle d&apos;un cas de force majeure. À ce titre, la force majeure s&apos;entend
                  de tout événement extérieur, imprévisible et irrésistible au sens de l&apos;article 1148 du Code civil. Tout autre
                  cas est expressément exclu. La Partie victime de la Force Majeure informe immédiatement - par LRAR -
                  l&apos;autre Partie de sa survenance, de sa durée et de ses conséquences prévisibles. Les obligations des
                  Parties seront suspendues pendant toute la durée du cas de Force Majeure. Dans l&apos;hypothèse où cette
                  suspension durerait plus de trente (30) jours à compter de sa date de notification (date de réception
                  ou de première présentation de la LRAR), la Partie la plus diligente pourra notifier par LRAR à l&apos;autre
                  Partie la résiliation immédiate du Contrat, sans qu&apos;il y ait lieu à une indemnisation quelconque
                  En cas de force majeure, le Vendeur ne facturera pas de frais et procèdera au remboursement (dans
                  l&apos;éventualité où ceux-ci sont applicables) des Acheteurs affectés par ledit cas de force majeure. Les

                  remboursements s&apos;appliquent à tous les frais, dépenses et divers montants engagés, notamment aux
                  tarifs (non-remboursables) ou aux défections, aux frais d&apos;annulation ou de (modification de)
                  réservation, ainsi qu&apos;aux frais engagés pour (i) toute annulation ou modification de réservation
                  effectuée à l&apos;initiative du Acheteur, ou (ii) concernant la partie de réservation non consommée du fait
                  de la survenance d&apos;un cas de force majeure.
                  En cas de doute raisonnable et justifié, le Vendeur est en mesure d&apos;exiger de l&apos;Acheteur l&apos;apport d&apos;une
                  preuve raisonnable du lien de causalité entre le cas de force majeure et l&apos;annulation, la défection ou la
                  modification de réservation (et, le cas échéant, la présentation à Biolibairterre SAS du justificatif y
                  correspondant). Le Vendeur doit communiquer à Biolibairterre SAS les détails afférents au Produit
                  touché par le cas de force majeure de façon à ce que Biolibairterre SAS puisse prendre acte de toute
                  annulation, défection ou modification de réservation relative à un cas de force majeure. Biolibairterre
                  SAS ne facturera pas de frais de commission sur les défections, annulations et parties de réservations
                  non consommées résultant dudit cas de force majeure.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-2">Article 14. Durée - Résiliation - Cessation du contrat</h4>
                <p className="text-gray-600">
                  Le présent Contrat est conclu pour une durée minimum d&apos;un (1) an, renouvelable par tacite
                  reconduction à chaque fois pour une même période d&apos;un (1) an.
                  A l&apos;expiration de chaque période d&apos;un (1) ans, il pourra être résilié par l&apos;une ou l&apos;autre Partie, sous réserve
                  d&apos;un préavis minimal de six (6) mois avant l&apos;expiration de la période d&apos;un (1) an en cours et à compter
                  de la réception de la notification qui sera faite à Biolibairterre SAS par lettre recommandée avec accusé
                  de réception.
                  Un Vendeur sélectionné par Biolibairterre SAS respectera un préavis de 6 mois pour sortir de la
                  plateforme et des plateformes partenaires de Biolibairterre SAS. Il est ici précisé en tant que de besoin
                  que l&apos;écoulement des stocks par les clients de Biolibairterre SAS sera quant à lui non limité par un
                  quelconque délai. Un vigneron reste engagé par le présent accord tant que la totalité des échéances et
                  factures restant dues, jusqu&apos;au terme de la période d&apos;engagement, ne sont pas réglés à Biolibairterre
                  SAS.
                  En cas d&apos;inexécution et/ou de mauvaise exécution du Contrat par le Vendeur, le Contrat pourra être
                  résilié de plein droit à la demande de Biolibairterre SAS quinze (15) jours après une mise en demeure,
                  par email ou lettre recommandée avec accusé de réception restée sans effet et précisant la ou les
                  obligations en souffrance, et selon la gravité de la situation avec préjudice de toute demande de
                  dommages et intérêts.
                  Les éléments qui amènerait Biolibairterre SAS à résilier de plein droit le contrat et formuler une
                  demande de dommages et intérêts sont:
                  La constatation de mauvaise application de prix de vente
                  Le passage en direct du Vendeur auprès de l&apos;Acheteur et prospect de Biolibairterre SAS
                  Le non-respect ou l&apos;accumulation de non-respect de commandes donnant suite à une insatisfaction
                  des Acheteurs ou des équipes Biolibairterre SAS
                  Le manquement caractérisé d&apos;application de la charte fournisseur Biolibairterre SAS
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-2">Article 15. Tribunal compétent</h4>
                <p className="text-gray-600">
                  Tout litige relatif à l&apos;interprétation et à l&apos;exécution des présentes conditions générales de vente est
                  soumis au droit français.
                  À défaut de résolution amiable, le litige sera porté devant le Tribunal de commerce de Libourne.
                </p>
              </div>
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
