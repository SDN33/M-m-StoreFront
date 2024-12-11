import React, { useEffect } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    FB: {
      XFBML: {
        parse: () => void;
      };
    };
  }
}



const BioWineDescription: React.FC = () => {

  useEffect(() => {
    // Réinitialiser le widget Facebook si FB est défini
    if (window.FB) {
      window.FB.XFBML.parse();
    }
  }, []);


  return (
    <>
      <Script
        id="facebook-sdk"
        strategy="afterInteractive"
        async
        defer
        crossOrigin="anonymous"
        src="https://connect.facebook.net/fr_FR/sdk.js#xfbml=1&version=v21.0"
        onLoad={() => {
          if (window.FB) {
            window.FB.XFBML.parse();
          }
        }}
      />
      <section className="bg-teal-50 py-16 px-6 text-center -mt-2 lg:-mt-16">
        <div className="max-w-6xl mx-auto">
          <p className="text-base text-gray-600 mb-8 font-serif ">
            Mémé Georgette vous propose une large sélection de vins bio et biodynamiques. Que vous soyez amateur de vins rouges, blancs, rosés, pétillants ou liquoreux, nous vous offrons des vins de qualité supérieure, élaborés selon des méthodes respectueuses de l&apos;environnement et de la biodiversité. L&apos;achat de vins bio n&apos;a jamais été aussi simple et agréable grâce à notre boutique en ligne, qui vous permet de découvrir les meilleures cuvées de vignerons engagés dans l&apos;agriculture biodynamique. Nos vins sont soigneusement sélectionnés pour répondre aux exigences des connaisseurs tout en étant accessibles à tous.
          </p>
          <div className='flex justify-center mx-auto mb-8'>
            <iframe src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fmemegeorgette&tabs&width=340&height=70&small_header=true&adapt_container_width=true&hide_cover=true&show_facepile=true&appId" width="340" height="70" style={{ border: 'none', overflow: 'hidden' }} scrolling="no" frameBorder="0" allowFullScreen={true} allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
          </div>

          {/* Grille des paragraphes avec illustration */}
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg hover:shadow-lg transition">
              <div className="flex items-center justify-center space-x-8 mb-4">
                <h3 className="text-lg font-serif text-gray-500 text-center">Vins Rouges Bio<br />Un goût authentique</h3>
              </div>
              <p className="text-gray-500 text-sm font-serif text-center">
                Les <a href='/vins/rouge'>vins rouges bio</a> de Mémé Georgette sont une véritable invitation à redécouvrir des saveurs authentiques. Chaque bouteille est le fruit du savoir-faire de vignerons passionnés par la biodynamie, qui cherchent à exprimer toute la richesse de leur terroir. Offrez-vous un achat de vin bio qui respectera l&apos;environnement tout en vous offrant une expérience de dégustation unique. Les vins rouges bio sont idéals pour accompagner vos repas de viande ou de fromage affinés. En optant pour des vins rouges biodynamiques, vous choisissez un produit respectueux de la terre et des hommes, cultivé sans pesticides ni produits chimiques.
              </p>
              </div>

            <div className="bg-white p-6 rounded-lg hover:shadow-lg transition">
              <div className="flex items-center justify-center space-x-8 mb-4">
                <h3 className="text-lg font-serif text-gray-500">Vins Blancs Bio<br />Légèreté et fraîcheur</h3>
              </div>
              <p className="text-gray-500 text-sm font-serif">
                Nos <a href='/vins/blanc'>vins blancs bio</a> sont élaborés selon des pratiques biodynamiques qui permettent de préserver la fraîcheur et la légèreté des arômes. Ces vins blancs bio sont parfaits pour les apéritifs estivaux ou pour accompagner des plats de poisson ou des fruits de mer. En choisissant l&apos;achat de vins blancs biodynamiques, vous optez pour une production responsable qui respecte la nature et ses cycles. De plus, chaque vin blanc bio que nous proposons est certifié et traçable, vous garantissant une qualité sans compromis. Nos vins blancs bio sont le choix idéal pour les connaisseurs soucieux de leur impact environnemental.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg hover:shadow-lg transition">
              <div className="flex items-center justify-center space-x-8 mb-4">
                <h3 className="text-lg font-serif text-gray-500">Vins Rosés Bio<br />Fraîcheur et fruité</h3>
              </div>
              <p className="text-gray-500 text-sm font-serif">
                Les <a href='/vins/rose'>vins rosés bio</a> de Mémé Georgette offrent une palette de saveurs fruitées et rafraîchissantes. Grâce à l&apos;agriculture biodynamique, chaque bouteille de vin rosé est l&apos;expression d&apos;un terroir unique, cultivé de manière respectueuse de l&apos;environnement. Ces vins sont parfaits pour les repas légers, les barbecues ou les soirées entre amis. L&apos;achat de vins rosés bio permet de consommer responsable tout en savourant des produits de qualité. Les vins rosés biodynamiques sont de plus en plus appréciés pour leur caractère authentique et leur engagement en faveur d&apos;une viticulture durable.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg hover:shadow-lg transition">
              <div className="flex items-center justify-center space-x-8 mb-4">
                <h3 className="text-lg font-serif text-gray-500">Vins Pétillants Bio<br />Pour toutes les occasions</h3>
              </div>
              <p className="text-gray-500 text-sm font-serif">
                Nos <a href='/vins/petillant'>vins pétillants bio</a> sont élaborés avec soin pour vous offrir des bulles fines et élégantes. Que vous fêtiez un anniversaire ou un événement spécial, les vins pétillants biodynamiques de Mémé Georgette ajoutent une touche de magie à chaque moment. L&apos;achat de vins biodynamiques permet de soutenir des pratiques agricoles durables tout en savourant des produits d&apos;exception. De plus, nos vins pétillants bio sont parfaits pour accompagner des mets raffinés, des desserts ou tout simplement pour célébrer la vie avec des amis.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg hover:shadow-lg transition">
              <div className="flex items-center justify-center space-x-8 mb-4">
                <h3 className="text-lg font-serif text-gray-500">Vins Liquoreux Bio<br />Douceur et raffinement</h3>
              </div>
              <p className="text-gray-500 text-sm font-serif">
                Nos <a href='/vins/liquoreux'>vins liquoreux bio</a> sont parfaits pour accompagner des desserts ou des moments de dégustation raffinée. Grâce à la biodynamie, ces vins sont produits avec un respect total des cycles naturels. Offrez-vous un achat de vins liquoreux bio et laissez-vous séduire par leur douceur et leur richesse aromatique. En choisissant un vin liquoreux biodynamique, vous optez pour un produit à la fois gourmand et respectueux de l&apos;environnement, idéal pour des repas de fêtes ou des dégustations spéciales.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg hover:shadow-lg transition">
              <div className="flex items-center justify-center space-x-8 mb-4">
               <h3 className="text-lg font-serif text-gray-500">Autres Vins Bio<br />Diversité et qualité</h3>
              </div>
              <p className="text-gray-500 text-sm font-serif">
                Découvrez également notre sélection d&apos;autres vins bio provenant de terroirs exceptionnels. Chaque vin est un exemple de l&apos;agriculture biodynamique à son meilleur, offrant une expérience de dégustation unique tout en respectant l&apos;environnement. L&apos;achat de vins bio, c&apos;est choisir des produits durables, respectueux de la nature et des hommes. Nos autres vins bio sont cultivés selon des méthodes agricoles qui préservent la biodiversité et favorisent un environnement sain et durable. Que vous soyez amateur de vins rouges, blancs ou autres, notre gamme vous garantit des vins de qualité pour toutes les occasions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BioWineDescription;
