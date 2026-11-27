// Album page content. Each album below is fully independent: nothing is shared
// between them, so edit one without affecting the others.
// album.html?id=<key> shows the album stored under that key.
//
// To add an album: copy one whole block (from `key: {` to its closing `},`),
// give it a new key, and link to album.html?id=<newkey> from albumes.html.
//
// Fields (every one is per album):
// - title, year, cover : header, "Title (year)" and the cover image
// - text     : array of paragraphs, one string per paragraph
// - bandcamp : Bandcamp embed, shown right after the text, before videos/photos.
//              Paste the full embed code from Bandcamp (Share / Embed -> Embed this album):
//                bandcamp: '<iframe style="border: 0; width: 350px; height: 470px;" src="https://bandcamp.com/EmbeddedPlayer/album=XXXX/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=small/transparent=true/" seamless></iframe>'
//              - Only the iframe's src, width and height are used; src must be an https bandcamp.com URL.
//              - A bare URL (the src alone) also works.
//              - '' (empty) shows a "Reproductor de Bandcamp próximamente" box.
//              - Delete the line to hide the section.
// - videos   : [{ title, youtubeId }]. Empty youtubeId shows "Video próximamente".
//              Use as many as you need; empty array [] (or delete the line) hides the section.
// - gallery  : [{ src, alt }] related photos. Empty array or no line hides the section.
// - press    : [{ title, outlet, url }]. url '#' = placeholder. Empty array or no line hides the section.

window.albumsData = {

  // ---------------------------------------------------------------- Interbalnearia
  interbalnearia: {
    title: 'Interbalnearia',
    year: 2026,
    cover: './images/carlos-interbalnearia.png',

    text: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
      'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.',
      'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.',
      'Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint.'
    ],

    bandcamp: '<iframe style="border: 0; width: 100%; height: 42px;" src="https://bandcamp.com/EmbeddedPlayer/album=3655840525/size=small/bgcol=333333/linkcol=4ec5ec/transparent=true/" seamless><a href="https://littlebutterflyrecords.bandcamp.com/album/interbalnearia">Interbalnearia by Carlos Casacuberta</a></iframe>',

    videos: [
      { title: 'Interbalnearia - video 1', youtubeId: '' },
      { title: 'Interbalnearia - video 2', youtubeId: '' }
    ],

    gallery: [
      { src: './images/carlos-retrato.png', alt: 'Carlos Casacuberta, retrato' },
      { src: './images/carlos-naturaleza.png', alt: 'Naturaleza (2013)' },
      { src: './images/carlos-carlos.png', alt: ':Carlos (2006)' }
    ],

    press: [
      { title: 'Interbalnearia: lorem ipsum dolor sit amet, consectetur adipiscing', outlet: 'Medio de prensa A', url: '#' },
      { title: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem', outlet: 'Medio de prensa B', url: '#' },
      { title: 'Neque porro quisquam est qui dolorem ipsum quia dolor', outlet: 'Medio de prensa C', url: '#' }
    ]
  },

  // ---------------------------------------------------------------- Naturaleza
  naturaleza: {
    title: 'Naturaleza',
    year: 2013,
    cover: './images/carlos-naturaleza.png',

    text: [
      'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi.',
      'Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus.',
      'Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer ligula vulputate sem tristique cursus. Nam nulla quam, gravida non, commodo a, sodales sit amet, nisi. Pellentesque fermentum dolor. Aliquam quam lectus, facilisis auctor, ultrices ut, elementum vulputate, nunc. Sed adipiscing ornare risus. Morbi est est, blandit sit amet, sagittis vel, euismod vel, velit.',
      'Pellentesque egestas sem. Suspendisse commodo ullamcorper magna. Cras ornare tristique elit. Vivamus vestibulum nulla nec ante. Praesent placerat risus quis eros. Fusce pellentesque suscipit nibh. Integer vitae libero ac risus egestas placerat. Vestibulum commodo felis quis tortor. Ut aliquam sollicitudin leo. Cras iaculis ultricies nulla. Donec quis dui at dolor tempor interdum.',
      'Nunc nonummy metus. Vestibulum volutpat pretium libero. Cras id dui. Aenean ut eros et nisl sagittis vestibulum. Nullam nulla eros, ultricies sit amet, nonummy id, imperdiet feugiat, pede. Sed lectus. Donec mollis hendrerit risus. Phasellus nec sem in justo pellentesque facilisis. Etiam imperdiet imperdiet orci. Nunc nec neque. Phasellus leo dolor, tempus non, auctor et, hendrerit quis, nisi. Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo.'
    ],

    bandcamp: '',

    videos: [
      { title: 'Naturaleza - video 1', youtubeId: '' },
      { title: 'Naturaleza - video 2', youtubeId: '' },
      { title: 'Naturaleza - video 3', youtubeId: '' }
    ],

    gallery: [
      { src: './images/carlos-retrato.png', alt: 'Carlos Casacuberta, retrato' },
      { src: './images/carlos-interbalnearia.png', alt: 'Interbalnearia (2026)' },
      { src: './images/carlos-carlos.png', alt: ':Carlos (2006)' }
    ],

    press: [
      { title: 'Naturaleza: pellentesque habitant morbi tristique senectus', outlet: 'Medio de prensa D', url: '#' },
      { title: 'Aenean fermentum, elit eget tincidunt condimentum eros ipsum', outlet: 'Medio de prensa E', url: '#' }
    ]
  },

  // ---------------------------------------------------------------- :Carlos
  carlos: {
    title: ':Carlos',
    year: 2006,
    cover: './images/carlos-carlos.png',

    text: [
      'Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam.',
      'Maecenas fermentum consequat mi. Donec fermentum. Pellentesque malesuada nulla a mi. Duis sapien sem, aliquet nec, commodo eget, consequat quis, neque. Aliquam faucibus, elit ut dictum aliquet, felis nisl adipiscing sapien, sed malesuada diam lacus eget erat. Cras mollis scelerisque nunc. Nullam arcu. Aliquam consequat. Curabitur augue lorem, dapibus quis, laoreet et, pretium ac, nisi.',
      'Aenean magna nisl, mollis quis, molestie eu, feugiat in, orci. In hac habitasse platea dictumst. Fusce convallis, mauris imperdiet gravida bibendum, nisl turpis suscipit mauris, sed placerat ipsum urna sed risus. In convallis tellus a mauris. Curabitur non elit ut libero tristique sodales. Mauris a lacus. Donec mattis semper leo. In hac habitasse platea dictumst.',
      'Vivamus facilisis diam at odio. Mauris dictum, nisi eget consequat elementum, lacus ligula molestie metus, non feugiat orci magna ac sem. Donec turpis. Donec vitae metus. Morbi tristique neque eu mauris. Quisque gravida ipsum non sapien. Proin turpis lacus, scelerisque vitae, elementum at, lobortis ac, quam. Aliquam dictum eleifend risus. In hac habitasse platea dictumst.',
      'Maecenas malesuada elit lectus felis, malesuada ultricies. Curabitur et ligula. Ut molestie a, ultricies porta urna. Vestibulum commodo volutpat a, convallis ac, laoreet enim. Phasellus fermentum in, dolor. Pellentesque facilisis. Nulla imperdiet sit amet magna. Vestibulum dapibus, mauris nec malesuada fames ac turpis velit, rhoncus eu, luctus et interdum adipiscing wisi. Aliquam erat ac ipsum. Integer aliquam purus. Quisque lorem tortor fringilla sed, vestibulum id, eleifend justo vel bibendum sapien massa ac turpis faucibus orci luctus non, consectetuer lobortis quis, varius in, purus.'
    ],

    bandcamp: '',

    videos: [
      { title: ':Carlos - video 1', youtubeId: '' }
    ],

    gallery: [
      { src: './images/carlos-retrato.png', alt: 'Carlos Casacuberta, retrato' },
      { src: './images/carlos-interbalnearia.png', alt: 'Interbalnearia (2026)' },
      { src: './images/carlos-naturaleza.png', alt: 'Naturaleza (2013)' }
    ],

    press: [
      { title: ':Carlos: curabitur pretium tincidunt lacus nulla gravida', outlet: 'Medio de prensa F', url: '#' },
      { title: 'Maecenas fermentum consequat mi donec fermentum', outlet: 'Medio de prensa G', url: '#' },
      { title: 'Aenean magna nisl, mollis quis, molestie eu', outlet: 'Medio de prensa H', url: '#' },
      { title: 'Vivamus facilisis diam at odio mauris dictum', outlet: 'Medio de prensa I', url: '#' }
    ]
  }

};
