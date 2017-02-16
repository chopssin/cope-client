(function($, Cope) {
var debug = Cope.Util.setDebug('cope-views', false),
    //Editor = Cope.useEditor(),
    PurelyViews = Cope.views('Purely'), // use Purely views
    
    Views = Cope.views('Cope'), // global views
    ViewAppCard = Views.class('AppCard'),
    ListItemView = Views.class('ListItem'),
    PurelyAppView = Views.class('Purely.App'),
    PurelySecView = Views.class('Purely.Sec'),
    PurelySettingsView = Views.class('Purely.Settings'),
    ViewAppPage = Views.class('AppPage'),
    ViewDataGraph = Views.class('DataGraph'),
    ViewAccountCard = Views.class('AccountCard'),
    ToggleView = Views.class('Toggle');

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
  //return '<div' + this.ID + '>' 
  //  + '<h3 data-component="name">Cope User</h3>'
  //  + '<p data-component="email"></p>'
  //  + '<button data-component="signout" class="cope-card as-btn bg-blue color-w">Sign out</button>'
  //  + '</div>';
//});

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
    let h = v.height.slice(0, v.height.length - 2);
    let top = h * v.idx;
    vu.$el().css({
      top: top + 'px'
    })
  });

});

// Purely - Purely.App
PurelyAppView.dom(vu => [
  { 'div.purely-app': [
    { 'div.sim-wrap.cope-card.bg-w(style="padding:0;z-index:49")': [
      { 'div.row': [
        { 'div@nav.col-xs-12': 'Nav' }] 
      },
      { 'div.sim-sections': [
        { 'div@page': '' }]
      }]
    },
    { 'div@sim-panel.sim-panel.cope-card.wider.bg-w': [
      { 'div@back.hidden(style="cursor: pointer;")': '<-' }, // Go Back button
      { 'div@app-settings': 'app-settings' }, // app-settings
      { 'div@sec-settings.hidden': 'sec-settings' }] // sec-settings
    }] 
  }
]);

PurelyAppView.render(vu => {
  let SAMPLE_TEXT = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nec est sed turpis tincidunt mollis. Duis nec justo tortor. Aliquam dictum dignissim molestie. Fusce maximus sit amet felis auctor pellentesque. \n\nSed dapibus nibh id rutrum elementum. Aliquam semper, ipsum in ultricies finibus, diam libero hendrerit felis, nec pharetra mi tellus at leo. Duis ultricies ultricies risus, sed convallis ex molestie at. Nulla facilisi. Ut sodales venenatis massa, nec venenatis quam semper eget.';

  // Set the whole page css
  vu.$el('.sim-wrap').css({
    'background-color': '#aca',
    'background-image': 'url("/images/sample1.jpg")'
  });

  // sections data
  let sections = [
    {
      type: 'collection',
      collection: {
        layout: 'slide',
        //col: 'Shoes',
        //sort: 'recent',
        data: [
          {
            title: 'We share gitts'
          },
          {
            title: 'And happines',
            src: '/images/sample1.jpg'
          }
        ]
      }
    },
    {
      type: 'basic',
      basic: {
        layout: 'single',
        title: 'Story',
        content: SAMPLE_TEXT,
        imgsrc: '/images/sample3.jpg'
      }
    },
    {
      type: 'basic',
      basic: {
        layout: 'single',
        title: 'Our Brand',
        content: SAMPLE_TEXT,
        imgsrc: '/images/sample1.jpg'
      }
    },
    {
      type: 'contacts',
      basic: {
        title: 'Contact us'
      },
      contacts: [
        { type: 'email', value: 'support@myapp.cope.tech' }, 
        { type: 'phone', value: '+886 987 654 321' } 
      ]
    }
  ];

  // makeList
  let makeList = function(o) {
    let secs = [],
        my = {};

    my.render = o.render;

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
      let wrap = o.viewClass.build({ //PurelySecView.build({
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
        sec.wrap.$el().off('click').on('click', function() {
          if (o.onclick) {
            o.onclick(sec, idx);
          }
        });  
      });    
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
    };

    my.swap = function(i, j) {

    };

    return my;
  };

  let Page = makeList({
    viewClass: PurelySecView,
    sel: vu.sel('@page'),
    height: '400px',
    onclick: function(sec, idx) {

      let vals = sections[idx];

      // Build the section editor on the right side
      let editSection = PurelyViews.class('Purely.Edit.Section.Settings').build({
        sel: vu.$el('@sec-settings')
      });

      editSection.res('vals', vals => {

        // Update data source
        sections[idx] = vals;
        // Update data for rendering
        if (vals.basic && vals.basic.content) {
          vals.basic.content = vals.basic.content.replace(/\n/g, '<br>');
        }
        sec.view.val(vals);
      });
      // Fill up editSection on the right side
      // with the selected section value
      editSection.val(vals);
      
      vu.$el('@back').removeClass('hidden');
      vu.$el('@app-settings').addClass('hidden');
      vu.$el('@sec-settings').removeClass('hidden');
    } // end of onClick
  }); // end of makeList

  // Build the initial sections
  sections.map((s, i) => {
    Page.insert(i, function(wrap, secs) {

      let build = function(wrap, p) {
        if (!p) p = {};
        if (!p.type) p.type = 'basic';
        if (!p.basic) {
          p.basic = {
            title: 'Section Title',
            content: 'More about this section.'
          };
        }

        let params = p;

          // Options for basic section views
        let basicLayouts = {
          single: 'Purely.Layout.Single'
        };

        // Decide basic section view class
        let viewClass = PurelyViews.class(basicLayouts[params.basic.layoyt || 'single']);

        // Initiate build settings
        let buildSettings = {};
        buildSettings.sel = wrap.sel('@sec');
        //buildSettings.method = 'append';
        buildSettings.data = params;

        wrap.res('after', idx => {
          Page.insert(idx, function(wrap, secs) {
            return build(wrap);
          });
        })
        .res('del clicked', Page.remove)
        .res('mask clicked', () => {
          // Fade out all sections except for self
          // secs.about.val('fadeOut', true);
          secs.map((x, idx) => {
            if (i != idx) {
              x.wrap.val('fadeOut', true);
            }
          });
          // Fade in the current section
          wrap.val('fadeIn', true);
        });

        return viewClass.build(buildSettings);
      }; // end of build

      return build(wrap, s);
      
    }); // end of Page.insert
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
  
  // vu.$el('@nav').off('click').on('click', () => {
  //   console.log('nav clicked');
  //   let navPanel = PurelyViews.class('Purely.Edit.Nav.Settings').build({
  //     sel: vu.sel('@sec-settings')
  //   });

  //   vu.$el('@back').removeClass('hidden');
  //   vu.$el('@app-settings').addClass('hidden');
  //   vu.$el('@sec-settings').removeClass('hidden');
  // });

}); //end of PureAppView.render

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
