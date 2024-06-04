# Tipsy

_A simple tip calculator and bill divider PWA_

[![Build Status][ci-image]][ci-url]
[![semantic-release][semantic-release-image]][semantic-release-url]

### Pitch

Figuring out how much you should add to the total bill for a tip, or how much everyone should pay
when ordering as a group can be difficult (even more so if you've "had a few"). Let Tipsy do the
math for you! It calculates the tip percentage, tip amount, grand total, and how much each person
should contribute when in a group. No more guess work.

### Origin

A friend of mine was using a popular mobile app for tipping and splitting bills, but it had become
so bogged down with ads that it was basically unusable. In response, I created a [free and open
source clone][nip-the-tip] for him to use instead. This is a recreation of that native Android™ app
using web technologies.

### Usage

Tipsy is a [progressive web app][pwa], intended to be used exclusively on mobile phones. Because it
is on the web, you can access it from any device with a modern web browser - but all design choices
have been made with phone usage in mind (and particularly those with larger screens).

### Run your own

[![Deploy to Netlify][deploy-image]][deploy-link]

[ci-image]:
  https://img.shields.io/github/actions/workflow/status/wKovacs64/tipsy/ci.yml?logo=github&style=flat-square
[ci-url]: https://github.com/wKovacs64/tipsy/actions?query=workflow%3Aci
[semantic-release-image]:
  https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square
[semantic-release-url]: https://github.com/semantic-release/semantic-release
[nip-the-tip]: https://github.com/wKovacs64/NipTheTip
[pwa]: https://developers.google.com/web/progressive-web-apps/
[deploy-image]: https://www.netlify.com/img/deploy/button.svg
[deploy-link]: https://app.netlify.com/start/deploy?repository=https://github.com/wKovacs64/tipsy
