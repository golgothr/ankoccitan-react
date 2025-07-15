import { Link } from 'react-router-dom';
import logo from '@/assets/logo.png';

export function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-occitan-light">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-orange-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2 group">
              <img
                src={logo}
                alt="Logo Ankòccitan"
                className="h-8 w-8 transition-transform duration-300 group-hover:scale-110"
              />
              <span className="text-xl font-bold text-gray-900">
                Ankòccitan
              </span>
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">Conditions d'utilisation</span>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/30">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Conditions d'utilisation
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8 text-center">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Acceptation des conditions
              </h2>
              <p className="text-gray-700 mb-4">
                En utilisant Ankòccitan, vous acceptez d'être lié par ces
                conditions d'utilisation. Si vous n'acceptez pas ces conditions,
                veuillez ne pas utiliser notre service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Description du service
              </h2>
              <p className="text-gray-700 mb-4">
                Ankòccitan est une plateforme d'apprentissage de l'occitan
                utilisant la méthode des cartes mémoire (spaced repetition).
                Notre service permet de créer, partager et étudier des decks de
                cartes pour l'apprentissage de la langue occitane.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Compte utilisateur
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Pour utiliser certaines fonctionnalités d'Ankòccitan, vous
                  devez créer un compte. Vous êtes responsable de :
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>
                    Maintenir la confidentialité de vos identifiants de
                    connexion
                  </li>
                  <li>
                    Toutes les activités qui se produisent sous votre compte
                  </li>
                  <li>
                    Nous informer immédiatement de toute utilisation non
                    autorisée
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Contenu utilisateur
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Vous conservez la propriété du contenu que vous créez sur
                  Ankòccitan. En partageant du contenu, vous accordez à
                  Ankòccitan une licence non exclusive pour l'utiliser dans le
                  cadre du service.
                </p>
                <p className="text-gray-700">
                  Vous vous engagez à ne pas publier de contenu :
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Diffamatoire, offensant ou inapproprié</li>
                  <li>Violant les droits de propriété intellectuelle</li>
                  <li>
                    Contenant des informations personnelles d'autrui sans
                    consentement
                  </li>
                  <li>Promouvant des activités illégales</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Utilisation acceptable
              </h2>
              <p className="text-gray-700 mb-4">
                Vous vous engagez à utiliser Ankòccitan uniquement à des fins
                légales et éducatives. Il est interdit d'utiliser le service
                pour :
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Harceler, intimider ou menacer d'autres utilisateurs</li>
                <li>Transmettre des virus ou du code malveillant</li>
                <li>Tenter d'accéder non autorisé à nos systèmes</li>
                <li>
                  Utiliser des bots ou scripts automatisés sans permission
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Propriété intellectuelle
              </h2>
              <p className="text-gray-700 mb-4">
                Ankòccitan et son contenu original sont protégés par les droits
                d'auteur et autres lois de propriété intellectuelle. Vous ne
                pouvez pas copier, modifier ou distribuer notre contenu sans
                autorisation écrite.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Limitation de responsabilité
              </h2>
              <p className="text-gray-700 mb-4">
                Ankòccitan est fourni "tel quel" sans garanties. Nous ne sommes
                pas responsables des dommages indirects, accessoires ou
                consécutifs résultant de l'utilisation du service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Modifications
              </h2>
              <p className="text-gray-700 mb-4">
                Nous nous réservons le droit de modifier ces conditions à tout
                moment. Les modifications prendront effet immédiatement après
                leur publication. Votre utilisation continue du service
                constitue votre acceptation des nouvelles conditions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Contact
              </h2>
              <p className="text-gray-700 mb-4">
                Si vous avez des questions concernant ces conditions
                d'utilisation, veuillez nous contacter à :
                <a
                  href="mailto:contact@ankoccitan.com"
                  className="text-occitan-red hover:text-occitan-orange transition-colors duration-200 ml-1"
                >
                  contact@ankoccitan.com
                </a>
              </p>
            </section>
          </div>

          {/* Bouton retour */}
          <div className="text-center mt-12">
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-occitan-red to-occitan-orange hover:from-occitan-orange hover:to-occitan-red transition-all duration-300 transform hover:scale-105"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TermsPage;
