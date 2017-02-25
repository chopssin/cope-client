(function($, Cope) {
var debug = Cope.Util.setDebug('cope-views', false),
    //Editor = Cope.useEditor(),
    PurelyViews = Cope.views('Purely'), // use Purely views
    
    Views = Cope.views('Cope'), // global views
    ViewAppCard = Views.class('AppCard'),
    ListItemView = Views.class('ListItem'),

    ViewAppPage = Views.class('AppPage'),
    ViewDataGraph = Views.class('DataGraph'),
    ViewAccountCard = Views.class('AccountCard'),
    ToggleView = Views.class('Toggle'),
    NavBoxView = Views.class('NavBox'),

    // Purely App
    SimSecClass = Views.class('SimSec'),

    PurelyAppView = Views.class('Purely.App'),
    PurelySecView = Views.class('Purely.Sec'),
    PurelySettingsView = Views.class('Purely.Settings'),  
    

    PurelyEditNavView = Views.class('Purely.Edit.Nav.Settiings'),// to be depreacted
    PurelyEditSingleView = Views.class('Purely.Edit.Single'), // to be deprecated
    SectionEditView = Views.class('Purely.Edit.Section.Settings'),
    PageEditView = Views.class('Purely.Edit.Page'),
    LayoutChooserView = Views.class('Purely.LayoutChooser'),
    
    //SectionEditView & PageEditView
    SectionEditView = Views.class('Purely.Edit.Section.Settings'),
    PageEditView = Views.class('Purely.Edit.Page'),

    priViews = Cope.useViews(), // private views
    ViewAddInput = priViews.class('AddInput');

// "AppCard"  
ViewAppCard.dom(function() {
  return '<div' + this.ID + ' class="cope-card wider touchable bg-w" style="margin-bottom:16px">'
    + '<h3 data-component="appName"></h3>'
    + '<p data-component="appId" style="color:#aaa"></p>'
    + '<p data-component="stat"></p>'
    + '</div>';
});

ViewAppCard.render(function() {
  var that = this,
      name = this.val('appName'),
      id = this.val('appId'),
      stat = this.val('stat');
  if (name) this.$el('@appName').html(name);
  if (id) this.$el('@appId').html(id);
  if (stat) this.$el('@stat').html(stat);

  that.$el().off('click').on('click', function() {
    that.res('touched', that.val());
  });
});  
// end of "AppCard"

// "AccountCard"
ViewAccountCard.dom(vu => [
  { 'div': [
    { 'h3@name': '' },
    { 'p@email': '' },
    { 'button@signOut.cope-card.as-btn.bg-blue.color-w': 'Sign out' }]
  }
]);

ViewAccountCard.render(vu => {
  var $signOut = vu.$el('@signOut'),
      email = vu.val('email'),
      name = vu.val('name');

  vu.$el('@name').text(name || 'Hello');
  if (email) vu.$el('@email').html(email);

  $signOut.off('click').on('click', function() {
    vu.res('sign out');
  });

  vu.$el('@name').off('dblclick').on('dblclick', function() {
    vu.res('change name', name || 'Cope User');
  });
});
// end of "AccountCard"

// NavBox
NavBoxView.dom(vu => [{ 'div(draggable = true)': '' }]);
NavBoxView.render(vu => {


  let height = vu.get('height') + 'px' || '50px';
      
  vu.$el().css({
    position: 'absolute',
    width: '100%',
    height: height,
    border: '1px solid #333',
    background: '#fff'
  });
  vu.use('idx, height').then(v => {
    let top = v.height * v.idx;
    //let dy = v.dy || 0;
    if (!v.isDragging) {
      vu.$el().css({
        'top': top + 'px'
        //'left': '0'
      });
    } else {
      vu.$el().css({
        'background': '#aca'
      });
    }
  });
});// end of NavBox

//PurelyEditNavView
PurelyEditNavView.dom( vu => [
  { 'div.view-purely-edit-nav': [
    { 'div@form.col-xs-12': [
      { 'h5': 'Site Title'},
      { 'input(type="text")@site-title': ''},
      { 'h5': 'Hosted By'},
      { 'input(type="text")@hosted-by': ''},
      { 'h5': 'Logo'},
      { 'div@image-uploader': ''},
      { 'div@save-btn(style="float: right; margin: 10px 0px; cursor: pointer;")': 'Save'}
    ]},
    { 'div@viewport.col-xs-12': ''}
  ]}
]);

PurelyEditNavView.render(vu => {
  
  // Image Uploader
  let imageuploaderview = PurelyViews.class('ImageUploader').build({
    sel: vu.sel('@image-uploader')
  });
  
  // @save-btn Click Event
  vu.$el('@save-btn').off('click').on('click',() => {
    let obj = {}
    obj.appName = vu.$el('@site-title').val().trim();
    obj.hostedBy = vu.$el('@hosted-by').val().trim();
    obj.images = imageuploaderview.val('files');
    console.log(obj);
    vu.res('save', obj);
  });
});

//PurelyEditSingle
PurelyEditSingleView.dom( vu => [
  { 'div.view-purely-edit-single': [
    { 'div@textarea.col-xs-12': [
      { 'h5': 'Title'},
      { 'div@title.title': ''},
      { 'h5': 'Content'},
      { 'div@content.content': ''},
      { 'div@image-uploader': ''},
      { 'div@save-btn(style="float: right; margin: 10px 0; cursor: pointer;")': 'Save'}
    ]}
  ]}
]);

PurelyEditSingleView.render( vu => {

  // Title textarea
  let title = PurelyViews.class('Textarea').build({
    sel: vu.sel('@title'),
    data: {
      value: 'Title'
    }
  });

  title.$el().css({
    'width': '100%',
    'border': '1px solid #aaa',
    'font-size': '14px'
  });

  // Content textarea
  let content = PurelyViews.class('Textarea').build({
    sel: vu.sel('@content'),
    data: {
      value: 'Content'
    }
  });
  content.$el().css({
    'margin-bottom': '16px',
    'border': '1px solid #aaa',
    'font-size': '14px'
  });

  // Image UpLoader
  let imageuploaderview = PurelyViews.class('ImageUploader').build({
    sel: vu.sel('@image-uploader')
  });

  //@save-btn Click Event
  vu.$el('@save-btn').off('click').on('click',() => {
    let obj = {}
    obj.title = title.val('value');
    obj.content = content.val('value');
    obj.images = imageuploaderview.val('files');
    console.log(obj);
    vu.res('save', obj);
  });
});


// Purely.Edit.Section.Settings
// @section-edit
// - vals: object
// - items: object, all items with names
// "box clicked" <- view object
SectionEditView.dom( vu => [
  { 'div@section-edit': ''}
]);

SectionEditView.render( vu => {
  let typeChooser,
      layoutChooser;

  // Init basic data
  vu.map('basic', basic => {
    if (!basic) { return {}; }
    return basic;
  });

  // Convert first character to uppercase
  let upper = function(str) {
    return str.slice(0, 1).toUpperCase().concat(str.slice(1));
  };
      
  vu.$el('@section-edit').html('');

  let items = {};
  let keys = [ 
    'title', 
    'content', 
    'textColor',
    'bgColor',
    'background',
    'layout'
  ]; 

  switch (vu.get('type')) {
    case 'collection':
    case 'contacts':
      keys = keys.concat([vu.get('type')]);
      break;
    default:
  }

  keys.map(key => { // keys become items with labels 

    let data = {};
    data.label = upper(key);

    if (key === 'title') { 
      data.editable = true;
      data.value = vu.get('basic').title || '';
      data.placeholder = 'Title the section';
    }
    
    if (key === 'content') {
      data.editable = true;
      data.value = vu.get('basic').content || '';
      data.textarea = true;
      data.placeholder = 'Compose more about this section';
    }

    if (key === 'textColor') {
      data.label = 'Text Color';
      data.editable = true;
      data.value = vu.get('basic').textColor || '';
      data.placeholder = '#333 or rgb(20, 20, 20)';
    }

    if (key === 'bgColor') {
      data.label = 'Background Color Mask';
      data.editable = true;
      data.value = vu.get('basic').bgColor || '';
      data.placeholder = '#333 or rgb(20, 20, 20)';
    }
    
    items[key] = PurelyViews.class('ListItem').build({
      sel: vu.sel('@section-edit'),
      method: 'append',
      data : data
    }).res('value', val => {
      //vals.basic[key] = val;
      //vu.set(vals);
      //vu.res('vals', vu.val());
      vu.map('basic', basic => {
        basic[key] = val;
        return basic;
      });

      vu.res('data', vu.get());
    });
  }); // end of the construction of items

  // Build layout chooser
  layoutChooser = LayoutChooserView.build({
    sel: items.layout.sel('@display'),
    data: {
      type: vu.get('type')
    }
  });
  layoutChooser.res('clicked', choice => {
    console.log(choice);
    vu.set('type', choice.type);
    vu.set('layout', choice.layout);
    vu.set('compLayout', choice.compLayout);
    vu.map(choice.type, typeData => {
      if (!typeData) { typeData = {}; }
      typeData.layout = choice.compLayout; // TBD: compLayout
      return typeData;
    });
    vu.map('basic', basic => {
      if (!basic) { basic = {}; }
      basic.layout = choice.layout;
      return basic;
    });
    vu.res('data', vu.get());
  });

  // Build the preview box of background
  let bgBox = PurelyViews.class('Box').build({
    sel: items.background.sel('@display')
  });
  
  bgBox.$el().off('click').on('click', e => {
    Cope.modal('file', {
      maxWidth: 500
    }).res('upload', arr => {
      vu.map('basic', basic => {
        if (arr && arr[0] && arr[0].image) {
          basic.imgsrc = arr[0].image;
        }
        return basic;
      }); 
      vu.res('data', vu.get());
    });
  });

  let bgBoxCSS = {
    'width': '100%',
    'height': '300px',
    'background-color': '#eee',
    'margin-top': '8px'
  };

  if (vu.get('basic').imgsrc) {
    bgBoxCSS['background-image'] = `url(${ vu.get('basic').imgsrc })`;
  }
  bgBox.$el().css(bgBoxCSS).addClass('bg-img');

  vu.set('items', items);
});

// PurelyEditNavView
// @nav-edit
PageEditView.dom( vu => [
  { 'div@nav-edit': 'page'}
]);

PageEditView.render( vu => {
  vu.$el().off('click').on('click', () => {
    console.log('ok');
  });
});

// Layout Chooser
// @layout-chooser
LayoutChooserView.dom( vu => [
  { 'div.view-layout-chooser': [
    { 'div.layout-chooser-sec': [
      { 'h4': 'Section Layout' },
      { 'div.subtitles': [
        { 'div@type-basic': 'Basic' },
        { 'div@type-collection': 'Collection' },
        { 'div@type-contacts': 'Contacts' }]
      },
      { 'div@type-layouts': '' }]
    },
    { 'div.layout-chooser-sec': [
      { 'h4@comp-custom-title': '' },
      { 'div@comp-custom-list': '' }]
    }] 
  }
]);

LayoutChooserView.render( vu => {
  let layouts = {},
      types = ['basic', 'collection', 'contacts'],
      textPos = ['left', 'right', 'center', 'none'],
      collectionTypes = ['slide', 'grid', 'waterfull'],
      contactsTypes = ['contacts'];
  
  // Init
  vu.set('type', vu.get('type') || 'basic');
  layouts.basic = textPos
    .filter(pos => pos != 'none')
    .map(pos => 'layout-' + pos);
  layouts.collection = [];
  layouts.contacts = [];

  // Build collection types
  collectionTypes.map(ct => {
    textPos.map(pos => {
      layouts.collection = layouts.collection.concat('layout-' + pos + '-' + ct);
    });
  });

  // Build contacts types
  contactsTypes.map(ct => {
    textPos.map(pos => {
      layouts.contacts = layouts.contacts.concat('layout-' + pos + '-' + ct);
    });
  });

  types.map(type => {
    vu.$el('@type-' + type).off('click').on('click', e => {
      vu('@type-layouts').html('');
      // Display type layouts
      layouts[type].map((layout, i) => {
        vu('@type-layouts').append([{ 'div.col-xs-6.col-xs-4': [
          [ 'div@block-' + i + '.bg-img.block', layout ]]
        }]);
        vu.$el(`@block-${i}`).off('click').on('click', e => {
          vu.set('preferences', {
            type: type,
            layout: layout
          })
          vu.res('clicked', vu.get('preferences'));
        });
      }); // end of layouts[type].map
    });
  }); // types.map

  // Build custom part for collection or contacts 
  customTitle = 'TBD'; // TBD !!!!!!!
  switch (vu.get('type')) {
    case 'collection': 
    vu.$el('@comp-custom-title').html();
    vu.$el('@comp-custom-list')
  }
}); // end of LayoutChooser

// Purely- Purely.SimSec
SimSecClass.dom(vu => [
  { 'div.sim-sec': [
    { 'div.inner-wrap': [
      { 'div@sec.inner-sec': '' }] 
    }] 
  }
]);

SimSecClass.render(vu => {
  let view, 
      vw, // viewport width
      vh = vu.get('height') || 400,
      sw,
      sh = 900, 
      sr = 1, // scale rate
      randomIdx, 
      onresize;

  // randomIdx for assigning onresize to window
  randomIdx = vu.map('randomIdx', r => {
    if (!r) { 
      return new Date().getTime() + '_' + Math.floor(Math.random()*1000); 
    }
    return r;
  });

  view = PurelyViews.class('Purely.Section').build({
    sel: vu.sel('@sec'),
    data: vu.get()
  });

  onresize = function() {
    vu.$el().css('height', vh);
    vw = vu.$el().width(); 

    sw = vw * sh / vh; 
    sr = vh / sh;
   
    vu.$el('@sec').css({
      width: sw + 'px',
      height: sh + 'px',
      'transform': `scale(${sr})`
    });

  }; // end of onresize
  
  // Scale the section on resize event
  $(window).off('resize.simsec-' + randomIdx).on('resize.simsec-' + randomIdx, onresize);
  onresize();
});

// Purely - Purely.Sec
PurelySecView.dom(vu => [
  { 'section.purely-sec': [
    { 'div.plus.top.hidden': [
      { 'div@before-plus': '+'},
      { 'div@delete.delete': 'x'}]
    },
    { 'div@wrap.wrap':[
      //{ 'div@sec.cope-card.full.bg-w.touchable(style="padding:0")': '' },
      { 'div@sec(style="padding:0")': '' },
      { 'div@mask.mask': ''}]
    },
    { 'div.plus.bottom.hidden': [
      { 'div@after-plus': '+'}]
    }]
  }
]);

PurelySecView.render(vu => {

  let showPlus = vu.val('showPlus') || true,
      fadeIn = vu.val('fadeIn'),
      fadeOut = vu.val('fadeOut'),
      hasFadedIn = vu.val('hasFadedIn');

  vu.$el().css({
    top: '-1000px'
  });

  if (fadeIn && !hasFadedIn) {
    vu.set('hasFadedIn', true);
    vu.$el('.plus').fadeIn(300);
    vu.set('fadeIn', false);
    vu.set('fadeOut', false);
  }
  if (fadeOut && hasFadedIn) {
    vu.set('hasFadedIn', false);
    vu.$el('.plus').hide(); //fadeOut(300);
    vu.set('fadeIn', false);
    vu.set('fadeOut', false);
  }

  vu.use('height').then(v => {
    vu.$el('@wrap').css('height', v.height);
    vu.$el('@sec').css('height', v.height);
  });

  //@mask click showPlus
  vu.$el('@mask').off('click').on('click', () => {
    if(showPlus){
      //vu.val('fadeIn', true);
      vu.res('mask clicked');
    }
  });

  vu.$el()
    .off('mouseenter mouseleave')
    .on('mouseenter mouseleave', () => {
    if(showPlus){
      //vu.val('fadeIn', true);
      vu.$el('.plus').toggleClass('hidden')
    }
  }); 

  // Click events
  // before -> myIdx - 1
  // after -> myIdx
  // res('after', ... )
  vu.$el('@before-plus').off('click').on('click', () => {
    vu.res('after', vu.get('idx'));
  });

  vu.$el('@after-plus').off('click').on('click', () => {
    vu.res('after', vu.get('idx') + 1);
  });

  vu.$el('@delete').off('click').on('click', () => {
    vu.res('del clicked', vu.get('idx'));
  });

  vu.use('idx, height').then(v => {
    // TBD: animate css top
    let top = v.height * v.idx;
    vu.$el().css({
      top: top + 'px'
    });
  });
});

// Purely - Purely.App
PurelyAppView.dom(vu => [
  { 'div.purely-app': [
    { 'div.sim-wrap': [
      { 'div.cope-card.bg-w.full(style="display:flex; padding:0; margin-bottom:16px;")': [
        { 'div@nav.col-xs-12(style="padding:0")': 'Nav' }] 
      },
      { 'div.cope-card.full(style="padding:0")': [
        { 'div.sim-sections': [
          { 'div@page': '' }]
        }]
      }]
    },
    { 'div@sim-panel.sim-panel.cope-card.wider.bg-w': [
      { 'div@back.hidden(style="cursor: pointer;")': '<-' }, // Go Back button
      { 'div@app-settings': 'app-settings' }, // app-settings
      { 'div@sec-settings.hidden': 'sec-settings' }] // sec-settings
    }, 
    { 'div.sim-page.cope-card.bg-w': [
      { 'div@sim-page.inner': '' }] 
    }]
  }
]);

PurelyAppView.render(vu => {

  // Reset
  vu.$el('@page').html('');

  let SAMPLE_TEXT = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nec est sed turpis tincidunt mollis. Duis nec justo tortor. Aliquam dictum dignissim molestie. Fusce maximus sit amet felis auctor pellentesque. \n\nSed dapibus nibh id rutrum elementum. Aliquam semper, ipsum in ultricies finibus, diam libero hendrerit felis, nec pharetra mi tellus at leo. Duis ultricies ultricies risus, sed convallis ex molestie at. Nulla facilisi. Ut sodales venenatis massa, nec venenatis quam semper eget.';

  let pages = vu.get('pages'), 
      sections = vu.get('sections');
  // Set the whole page css
  //vu.$el('.sim-sections').css({
  //  'background-color': '#000',
  //  'background-image': 'url("/images/sample4.jpg")'
  //});

  // pages data
  pages = [{
    title: 'Home'
  }, {
    title: 'Products'
  }, {
    title: 'Services'
  }, {
    title: 'Contacts'
  }];

  // sections data
  sections = sections || [
    {
      type: 'collection',
      layout: 'layout-left-slide',
      basic: {
        textColor: '#fff',
        bgColor: '#000',
        bgColorStrength: 0.8
      },
      collection: {
        layout: 'comp-bold-left',
        //col: 'Shoes',
        //sort: 'recent',
        data: [
          {
            title: 'Build your dream simply',
            imgsrc: '/images/sample1.jpg',
            textColor: '#333'
          },
          {
            title: 'And purely',
            textColor: '#fff',
            bgColor: '#000',
            colorStrength: 0.8
          }
        ]
      }
    },
    {
      type: 'basic',
      layout: 'layout-right',
      basic: {
        title: 'Story',
        content: SAMPLE_TEXT,
        textColor: '#fff'
      }
    },
    {
      type: 'basic',
      layout: 'layout-left',
      basic: {
        title: 'Our Brand',
        content: SAMPLE_TEXT,
        imgsrc: '/images/sample1.jpg'
      }
    },
    {
      type: 'contacts',
      basic: {
        title: 'Contact us',
        imgsrc: '/images/sample2.jpg',
        bgColor: '#000',
        textColor: '#fff'
      },
      contacts: {
        layout: 'comp-simple-contacts',
        data: [
          { type: 'email', value: 'support@myapp.cope.tech' }, 
          { type: 'phone', value: '+886 987 654 321' } 
        ]
      }
    }
  ];
  vu.set('sections', sections);

  // makeList
  // o: Object
  let makeList = function(o) {
    let secs = [],
        my = {};

    my.render = o.render;

    my.get = function(i) {
      return secs[i];
    };

    // s: params of the section
    my.insert = function(i, callback) {

      if (i > secs.length) return;
     
      // Handle the old array
      secs.map(sec => {
        let myIdx = sec.wrap.get('idx');
        if (myIdx >= i) {
          sec.wrap.val('idx', myIdx + 1);
        }
      });

      // Handle the new one
      let wrap = o.wrapClass.build({ //PurelySecView.build({
        sel: o.sel, //vu.sel('@page'),
        method: 'append',
        data: {
          height: o.height,
          idx: i
        }
      });

      let view = callback(wrap, secs);

      secs = secs.concat({
        wrap: wrap,
        view: view //viewClass.build(buildSettings)
      });

      secs.map((sec, idx) => {
        Object.keys(o).map(key => {
          if (key.indexOf('on') != 0) return;
          
          let evt = key.slice('2');
          sec.wrap.$el().off(evt).on(evt, function(e) {
            o[key](sec, sec.wrap.get('idx'), e);
          });
        }); // end of Object.keys ... map
      }); // end of secs.map
    }; // end of my.insert

    my.remove = function(i) {
      secs = secs.filter(sec => {
        if (sec.wrap.get('idx') === i) {
          sec.wrap.$el().fadeOut(300);
          return false;
        } else if (sec.wrap.get('idx') > i) {
          sec.wrap.val('idx', sec.wrap.get('idx') - 1);
        }
        return true;
      });
    }; // end of my.remove

    my.swap = function(i, j) {
      let wrap_i, wrap_j;
      let arr = [];
      arr = secs.map(sec => sec.wrap.get('idx'));
      wrap_i = arr.indexOf(i);
      wrap_j = arr.indexOf(j);
      if(wrap_i != wrap_j) {
        secs[wrap_i].wrap.val('idx', j);
        secs[wrap_j].wrap.val('idx', i);
      }
    }; // end of my.swap
    return my;
  };

  // Build page for page selector
  let pageThumbs = PurelyViews.class('Purely.Page').build({
    sel: vu.sel('@sim-page'),
    data: { bgAbs: true }
  });

  // PS: Page Selector
  let PS = PurelyViews.class('SortableList').build({
    sel: pageThumbs.sel('@page'),//vu.sel('@sim-page'),
    data: { height: 100 }
  });

  // Build page for section simulator
  let page = PurelyViews.class('Purely.Page').build({
    sel: vu.sel('@page')
  });

  // SS: Section Simulator
  let SS = PurelyViews.class('SortableList').build({
    sel: page.sel('@page'),
    data: { height: 400 }
  });

  PS.res('item clicked', item => {
    // TBD: Interact with SS
  });

  SS.res('item clicked', item => {
    console.log(item);
    // Interact with PS and EditSection
    // Build the section editor on the right side
    let editSection = SectionEditView.build({
      sel: vu.sel('@sec-settings')
    });
      
    // Update section simulator
    editSection.res('data', data => {
      item.view.val(data);
    });

    // Fill up editSection on the right side
    // with the selected section value
    editSection.val(item.view.val());
    
    vu.$el('@back').removeClass('hidden');
    vu.$el('@app-settings').addClass('hidden');
    vu.$el('@sec-settings').removeClass('hidden');
  });

  // Build the initial sections
  sections.map(p => {
    if (!p) p = {};
    if (!p.type) p.type = 'basic';
    if (!p.basic) {
      p.basic = {
        title: 'Section Title',
        content: 'More about this section.'
      };
    }
    
    let params = p,
        ssData = {},
        psData = {};
    
    for (let k in params) {
      psData[k] = params[k];
      ssData[k] = params[k];
    }
    psData.height = 100;
    ssData.height = 400;
    PS.val('new', {
      viewClass: SimSecClass,
      data: psData
    });

    SS.val('new', {
      viewClass: SimSecClass,
      data: ssData
    })
  }); // end of sections.map

  // Panel routing
  vu.$el('@back').off('click').on('click', e => {
    
    // Show settings of the app
    vu.$el('@app-settings').removeClass('hidden');

    // Hide others 
    vu.$el('@back').addClass('hidden');
    vu.$el('@sec-settings').addClass('hidden');
  });

  // App Settings
  let vals = vu.val();
  let settingItems = [];
  vu.$el('@app-settings').html('');

  if (vals) {
    settingItems = [{
      'label': 'App Name',
      'value': vals.appName || 'Untitled',
      'placeholder': 'Enter the app name or site title',
      'editable': true
    }, {
      'label': 'App ID',
      'value': vals.appId
    }, {
      'label': 'URL',
      'value': vals.url || (vals.appId + '.cope.tech')
    }, {
      'label': 'Status',
      'value': vals.stat || ''
    }].map(x => {
      return PurelyViews.class('ListItem').build({
        sel: vu.sel('@app-settings'),
        method: 'append',
        data: x
      });
    });
  } // end of if
 
  // To edit app name!!!
  settingItems[0].res('done', val => {
    vu.res('rename app', val);
  });
  
  // Navigation
  PurelyViews.class('Nav').build({
    sel: vu.sel('@nav'),
    data: {
      logo: {
        text: 'Logo'
      }
    }
  })
  
  // Nav click event
  vu.$el('@nav').off('click').on('click', () => {
    
    let SL = PurelyViews.class('SortableList').build({
      sel: vu.sel('@sec-settings'),
      data: { height: 30 }
    });

    pages.map(x => {
      SL.val('new', {
        viewClass: PurelyViews.class('ListItem'),
        data: { label: x.title }
      });
    });

    vu.$el('@back').removeClass('hidden');
    vu.$el('@app-settings').addClass('hidden');
    vu.$el('@sec-settings').removeClass('hidden');
  }); // Nav click event
}); //end of PureAppView.render
















// Deprecated

// "AppPage"
// "rename app" <= string, the new name
ViewAppPage.dom(vu => [
  { 'div.row': [
    { 'div.col-xs-12(style="height:700px; overflow:hidden")': [
      { 'div.cope-card.bg-w.node-data.hidden': '' },
      { 'div@svg.svg-wrap(style="width:100%")': '' },
      { 'div@card.cope-card.touchable.wrap.bg-w(style="text-align:left")': [
        { 'ul': [
          { 'li@display-li(style="display:table;")': [
            { 'div.title': 'App Name' }, 
            { 'div@appName': '' },
            { 'div@appName-edit.hidden': [
              { 'input(type="text" placeholder="App Name" style="display:block; outline:none;")': '' },
              { 'div(style="display:block; float:right;")': [
                { 'span@renameCancel.cope-card.as-btn.bg-w.color-blue':'Cancel' },
                { 'span@renameDone.cope-card.as-btn.bg-blue.color-w':'Save' }] 
              }]
            }] 
          }, 
          { 'li': [
            { 'div.title': 'App ID' },
            { 'div@appId': '' }] 
          }, 
          { 'li': [
            { 'div.title': 'URL' },
            { 'div@url': '' }] 
          }, 
          { 'li': [
            { 'div.title': 'Owner' },
            { 'div@owner': '' }] 
          }, 
          { 'li': [ 
            { 'div.title': 'Partners' },
            { 'div@partners': '' },
            { 'a@add-partner.hidden': 'Add partner' }]
          },
          { 'li': [ 
            { 'div.title': 'Status' },
            { 'div@stat': '' }]
          }]
        }] 
      },
      { 'div.cope-card.touchable.wrap.bg-w(style="text-align:left")': [
        { 'ul': [
          { 'li': [
            { 'div': 'Purely' }] 
          }] 
        }] 
      }]
    }] 
  }
]);

ViewAppPage.render(vu => {
  let appName = vu.val('appName') || 'Untitled', // string
      appId = vu.val('appId'), // string
      url = vu.val('url'), // string
      isOwner = vu.val('isOwner'),
      owner = vu.val('owner'), // string
      partners = vu.val('partners'), // string array
      stat = vu.val('stat'); // status

  vu.$el('@appName').html(appName.trim() || 'Untitled');
  vu.$el('@appId').html(appId);

  if (isOwner || (owner == 'Me')) {
    vu.$el('@add-partner').removeClass('hidden');
  }

  if (owner) {
    vu.$el('@owner').html(owner);
  } 
  if (partners) {
    // TBD: partners
    vu.$el('@partners').html(partners);
  }

  if (url) {
    vu.$el('@url').html(url);
  } else {
    vu.$el('@url').html(appId + '.cope.tech');
  }

  if (stat) {
    vu.$el('@stat').html(stat);
  }

  // @appName click event
  vu.$el('@appName').off('dblclick').on('dblclick', () => {
    vu.$el('@appName-edit').find('input')
      .val(vu.val('appName') || 'Untitled');

    setTimeout(() => {
      vu.$el('@appName-edit').find('input').trigger('focus');
    }, 200);

    vu.$el('@appName').addClass('hidden');
    vu.$el('@appName-edit').removeClass('hidden');
  });

  // @appName-edit Rename button "Cancel" click event
  vu.$el('@renameCancel').off('click').on('click', function(e) {
    vu.$el('@appName-edit').addClass('hidden');
    vu.$el('@appName').removeClass('hidden');
  });

  // @appName-edit Rename button "Done" click event
  vu.$el('@renameDone')
    .off('click')
    .on('click', function(e) {

    vu.$el('@appName-edit').addClass('hidden');
    vu.$el('@appName').removeClass('hidden');

    let newName = vu.$el('@appName-edit').find('input').val().trim();
    if (newName != vu.get('appName')) {

      // Update app name
      vu.res('rename app', newName);
      vu.val('appName', newName);
    }
  });

  vu.$el('.as-btn').css({
    'display': 'inline-block',
    'padding': '6px',
    'font-size': '13px',
    'margin': '4px 0 4px 4px'
  });

  // val.owner
  // val.partners
  // val.expiredAt
}); // end of ViewAppPage.render

ViewAppPage.render(vu => { // draw the graph
  var graph = vu.val('graph'),
      $card = vu.$el('@card'),
      $li = vu.$el('@display-li'),
      $addPartner = vu.$el('@add-partner'),
      $svgWrap = vu.$el('@svg'),
      w = $svgWrap.width(),
      that = vu;

  if (!graph || !w || !$svgWrap) return;
  
  // Build the graph view  
  Views.class('DataGraph').build({
    sel: vu.sel('@svg'),
    data: {
      width: w,
      height: 600,
      graph: graph
    }
  }).res('node-data', function(_d) {
    debug(_d);  
    that.$el('.node-data').removeClass('hidden');
    that.$el('.node-data').html(`name:${_d.id}`);
  });

  $card.css('z-index', 1);
  $svgWrap.css('z-index', 0);

  // To switch between the graph view and app card
  $card.off('click').on('click', function() {
    $card.find('li').removeClass('hidden');
    $li.removeClass('hidden');
  });

  $svgWrap.off('click').on('click', function() {
    // Note: trigger click before the following
    vu.$el('@renameCancel').click();

    $card.find('li').addClass('hidden');
    $li.removeClass('hidden');
  });

  // Set "add partner" link
  $addPartner.off('click').on('click', function() {
    //Editor.openModal(function(_sel) { 
    //  ViewAddInput.build({
    //    sel: _sel,
    //    data: { placeholder: 'Email' }
    //  }).res('value', function(_val) {
        that.res('add-partner');  
    //  });
    //}); // end of Editor.openModal
  }); // end of $addPartner click
}); // end of ViewAppPage.render // draw the graph
// end of "AppPage"

// DataGraph
// properties:
// - width
// - height
// - appId
ViewDataGraph.dom(function() {
  var w = this.val('width'), 
      h = this.val('height');
  return '<svg' + this.ID + 'id="svg" width="'+ w +'" height="' + h + '"></svg>';
});

ViewDataGraph.render(function() {
  var graph = this.val('graph'),
      that = this;

  debug('ViewDataGraph - graph', graph);

  var svg = d3.select("svg#svg"),
      width = +svg.attr("width"),
      height = +svg.attr("height");
  
  if (!graph || !width || !height) return;
  
  var color = d3.scaleOrdinal(d3.schemeCategory20);

  var simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d.id; }))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2));

  var link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(graph.links)
      .enter().append("line")
      .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

  var node = svg.append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(graph.nodes)
      .enter().append("circle")
      .attr("r", 5)
      .attr("fill", function(d) { return color(d.group); })
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

  node.append("title")
    .text(function(d) { return d.id; });

  simulation
    .nodes(graph.nodes)
    .on("tick", ticked);

  simulation.force("link")
    .links(graph.links);

  function ticked() {
    link
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

    node
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
  }

  function dragstarted(d) {
    that.res('node-data', d);

    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;

    console.log(d);
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
}); // end of ViewDataGraph.render
// end of "DataGraph"

// "AddInput"
ViewAddInput.dom(function() {
  var ph = this.val('placeholder');
  return '<div' + this.ID + '>' 
    + '<input type = "text" placeholder="' + ph + '">'
    + '<button class="cope-card final">Add</button>'
    + '</div>';
}); 

ViewAddInput.render(function() {
  var that = this;
  this.$el('button').off('click').on('click', function() {
    that.res('value', that.$el('input').val().trim());
  });
});
// end of "AddInput"

// "Toggle"
// @sec-dashboard
// @account
// @my-apps
// @sec-app
// @app: show data graph
// @app-purely: Purely live editor
// -sec: string, 'home' || 'app'
ToggleView.dom(vu => `
  <div ${vu.ID} class="container" style="margin-bottom:100px">
    <div data-component="sec-dashboard" class="row">
      <div class="col-xs-12 col-md-4 col-md-push-8">
        <h4>Account</h4>
        <div data-component="account" class="cope-card bg-w wider"></div>
      </div>
      <div class="col-xs-12 col-md-8 col-md-pull-4">
        <h4>Apps</h4>
          
        <div class="row">
          <div data-component="my-apps" class="col-xs-12"></div>
          <div class="col-xs-12">
            <button class="cope-card as-btn bg-blue color-w">Add new app</button>
          </div>
        </div>
        
      </div>
    </div>` // end of dashborad
    + `<div data-component="sec-app" class="hidden">
      <div data-component="app" class="col-xs-12"></div>
      <div data-component="app-purely" class="col-xs-12"></div>
    </div>
  </div> 
`);

ToggleView.render(vu => {
  switch (vu.get('sec')) {
    case 'app':
      vu.$el('@sec-dashboard').addClass('hidden');
      vu.$el('@sec-app').removeClass('hidden');
      vu.$el().removeClass('container');
      break;
    case 'home':
    default:
      vu.$el('@sec-app').addClass('hidden');
      vu.$el('@sec-dashboard').removeClass('hidden');
      vu.$el().addClass('container');
      break;
  } 
});

})(jQuery, Cope, undefined)
