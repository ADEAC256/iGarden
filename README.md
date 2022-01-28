# iGarden

<div id="top"></div>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributeurs][contributors-shield]][contributors-url]
[![LinkedIn Ismail][linkedin-shield]][linkedin-url]
[![LinkedIn Alexandra][linkedin-shield]][linkedin-url1]
[![LinkedIn Julie][linkedin-shield]][linkedin-url2]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/ADEAC256/iGarden" style = "background-color:green;">
    <img src="website/static/img/core-img/logo_repo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">iGarden</h3>

  <p align="center">
    Description du projet
    <br />
    <a href="https://github.com/ADEAC256/iGarden"><strong>Explore the docs »</strong></a>
    <br />
    <br />
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Site internet construit avec</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Pre-requis</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## A propos du projet

[![Product Name Screen Shot][product-screenshot]](https://example.com)

Here's a blank template to get started: To avoid retyping too much info. Do a search and replace with your text editor for the following: `github_username`, `repo_name`, `twitter_handle`, `linkedin_username`, `email`, `email_client`, `project_title`, `project_description`

<p align="right">(<a href="#top">back to top</a>)</p>

### Système construit avec

* [ESP32](https://www.gotronic.fr/art-module-nodemcu-esp32-28407.htm)
* [DHT22](https://www.gotronic.fr/art-capteur-de-t-et-d-humidite-dht22-20719.htm)
* [DS18B20](https://www.gotronic.fr/art-sonde-etanche-ds18b20-19339.htm)
* [Soil Moisture Sensor](https://tinydb.readthedocs.io/en/latest/gla)
* [TSL2561](https://learn.adafruit.com/tsl2561)
* [HC-SR04](https://www.gotronic.fr/art-module-de-detection-us-hc-sr04-20912.htm)
* [GoTronic PM3V](https://www.gotronic.fr/art-pompe-miniature-submersible-pm3v-32875.htm)
* [Adafruit Relay](https://www.adafruit.com/product/3191)


### Serveur construit avec

* [Flask](https://flask.palletsprojects.com/en/2.0.x/)
* [TinyDb](https://tinydb.readthedocs.io/en/latest/gla)

### Site internet construit avec

* [Bootstrap](https://getbootstrap.com)
* [JQuery](https://jquery.com)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Pre-requis

Pour pouvoir utiliser flask, vous aurez besoin d'installer virtualenv. Virtualenv aide un utilisateur à créer plusieurs environnements Python côte à côte . Ainsi, il peut éviter les problèmes de compatibilité entre les différentes versions des bibliothèques. Cette commande nécessite des privilèges d'administrateur. 
* virtualenv
  ```sh
  sudo pip3 install virtualenv 
  ```

### Installation

1. Cloner le repository
   ```sh
   git clone https://github.com/ADEAC256/iGarden.git
   ```
2. Installer flask
   ```sh
   pip3 install Flask
   ```
3. Installer flask_cors
   ```sh
   pip3 install -U flask-cors
   ```
3. Installer flask_mail
   ```sh
   pip3 install Flask-Mail
   ```
4. Installer TinyDB
   ```sh
   pip3 install tinydb
   ```

### Fichiers 

- `hardware` contient le software du système. Le code est à mettre sur l'ESP32
 
- `server` contient le software du serveur et la base de données.
 
- `website` contient tous les fichiers du site web.
 
- `documentation` contient la documentation (schema hardware, software, notice d'utilisation)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->
## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [ ] Feature 1
- [ ] Feature 2
- [ ] Feature 3
    - [ ] Nested Feature

See the [open issues](https://github.com/ADEAC256/iGarden/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

Your Name - [@twitter_handle](https://twitter.com/twitter_handle) - email@email_client.com

Project Link: [https://github.com/ADEAC256/iGarden](https://github.com/ADEAC256/iGarden)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* []()
* []()
* []()

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/github_username/repo_name.svg?style=for-the-badge
[contributors-url]: https://github.com/ADEAC256/iGarden/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/github_username/repo_name.svg?style=for-the-badge
[forks-url]: https://github.com/ADEAC256/iGarden/network/members
[stars-shield]: https://img.shields.io/github/stars/github_username/repo_name.svg?style=for-the-badge
[stars-url]: https://github.com/ADEAC256/iGarden/stargazers
[issues-shield]: https://img.shields.io/github/issues/github_username/repo_name.svg?style=for-the-badge
[issues-url]: https://github.com/ADEAC256/iGarden/issues
[license-shield]: https://img.shields.io/github/license/github_username/repo_name.svg?style=for-the-badge
[license-url]: https://github.com/ADEAC256/iGarden/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/ismail-bennis/
[linkedin-url1]: https://www.linkedin.com/in/alexandra-deac/
[linkedin-url2]: https://www.linkedin.com/in/julie-rago/
[product-screenshot]: images/screenshot.png
