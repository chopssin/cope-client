(function($, Cope) {

const Views = Cope.useViews('Purely');

let NavView = Views.class('Nav'),
  BoxView = Views.class('Box'),
  TilesView = Views.class('Tiles'),
  TextareaView = Views.class('Textarea'),
  ImageUploaderView = Views.class('ImageUploader'),
  PhotoView = Views.class('Photo'),
  GridView = Views.class('Grid'),
  SlideView = Views.class('Slide'),
  SelectView = Views.class('Select'),
  UListView = Views.class('UList'),
  FormView = Views.class('Form'),
  ListItemView = Views.class('ListItem'),
  
  ContactsView = Views.class('Contacts'), // to be deprecated

  PurelyPageClass = Views.class('Purely.Page'),
  PurelySectionClass = Views.class('Purely.Section'),
  PurelySectionBasicClass = Views.class('Purely.Section.Basic'),
  PurelySectionCollectionClass = Views.class('Purely.Section.Collection'),
  PurelySectionContactsClass = Views.class('Purely.Section.Contacts'),
  
  PurelyEditNavView = Views.class('Purely.Edit.Nav.Settiings'),// to be depreacted
  PurelyEditSingleView = Views.class('Purely.Edit.Single'), // to be deprecated
  SectionEditView = Views.class('Purely.Edit.Section.Settings'),
  PageEditView = Views.class('Purely.Edit.Page'),
  TypeChooserView = Views.class('Purely.TypeChooser'),
  LayoutChooserView = Views.class('Purely.LayoutChooser'),

  // Purely Layouts for basic sections
  PurelyLayoutSingleView = Views.class('Purely.Layout.Single'),

  // For collections
  PurelyLayoutSlideView = Views.class('Purely.Layout.Slide'),
  PurelyLayoutGridView = Views.class('Purely.Layout.Grid'),
  PurelyLayoutWaterfallView = Views.class('Purely.Layout.Waterfall');

// Nav
// "logo clicked" <- null, callback when @logo being clicked
NavView.dom( vu => [
  { 'header.view-nav': [
    { 'div@logo.logo.bg': '' },
    { 'div.float-right': [
      { 'nav': [
        { 'ul@main-items': '' }
      ]}
    ]},
    { 'div.view-nav-items.bg-w@menu': [
      { 'div.glyphicon.glyphicon-remove.float-right.remove-icon@close-button': '' },
      { 'nav(style = "text-align:center;")': [
        {'ul@nav-items': ''}
      ]}
    ]},
    { 'div(style = "z-index:2;").view-nav-items.bg-w@user-menu': [
      { 'div.glyphicon.glyphicon-remove.float-right.remove-icon@close-button': ''},
      { 'nav(style="text-align:center;")': [
        { 'ul@nav-items': ''}
      ]}
    ]}
  ]}
]);

NavView.render( vu=> {

  // Reset items
  vu.$el('@main-items').html(`
    <li data-component="user" class="hidden user"><a>User Name</a></li>
    <li data-component="signIn" class="hidden user"><a>Sign in</a></li>
    <li data-component="menu-button" class="menu-icon glyphicon glyphicon-menu-hamburger hidden"></li>
  `);
  vu.$el('@nav-items').html('');
  vu.$el('@user-items').html('');

  // Default Css setting 
  let defaultCss = {
    'height': '100%',
    'line-height': '100%'
  };

  //  Css
  vu.$el().css(defaultCss);
  
  // @logo
  vu.use('logo').then( v => {
    if (v.logo.imgsrc) {
      vu.$el('@logo').css('background-image',v.logo.imgsrc);
    }else {
      vu.$el('@logo').html(`${v.logo.text}`);
    }
  });

  vu.$el('@logo').off('click').on('click', function() {
    vu.res('logo clicked');
  });
  
  // @items
  vu.use('items').then( v => {
    let  navItems = [];
    function pend(item){
      
      let method = 'append';

      switch (item.type) {
        case "main":
          item.el = 'main-items';
          method = 'prepend';
          //mainItems.push(item);
          break;
        case "user":
          item.el = 'user-items';
          //userItems.push(item);
          break;
        default:
          item.el = 'nav-items';
          navItems.push(item);
      }

      if (item.href) {
        vu.$el(`@${item.el}`)[method](`<li data-component="${item.comp}" class="user hidden-xs"><a href="${itemhref}">${item.text}</a></li>`);
      } else {
        vu.$el(`@${item.el}`)[method](`<li data-component="${item.comp}" class="user hidden-xs"><a>${item.text}</a></li>`);
      }
    }
    //navItems.forEach(pend);
    v.items.forEach(pend);

    //setting click event
    vu.use('items').then( v =>{
      v.items.forEach(item => { 
      if (item.comp) {
        vu.$el(`@${item.comp}`).off('click').on('click',() => {
          vu.res('comp', item.comp);
        });
      }
      });
    });
    if (navItems.length > 0) {
      vu.$el('@menu-button').removeClass('hidden');
    }
  }); //end of items
  vu.use('usingMembers').then( v => {
    if (v.usingMembers) {
      vu.$el('@user').removeClass('hidden');
      vu.$el('@signIn').addClass('hidden');
    } else {
      vu.$el('@signIn').removeClass('hidden');
      vu.$el('@user').addClass('hidden');
    }
  });

  // animate
  vu.$el('@menu-button').off('click').on('click', () => {
    vu.$el('@menu').fadeIn(300);
    $(".logo float-right").hide();
  });

  vu.$el('@close-button').off('click').on('click', () => {
    vu.$el('@menu').fadeOut(300);
    vu.$el('@user-menu').fadeOut(300);
    $(".logo float-right").show();
  });

  vu.$el('@user').off('click').on('click', () => {
    vu.$el('@user-menu').fadeIn(300);
    $(".logo .float-right").hide();
  });

  // Set @signIn click event
  vu.$el('@signIn').off('click').on('click', () => {
    vu.res('signIn');
  });
  // Set @signOut click event
  vu.$el('@signOut').off('click').on('click', () => {
    vu.res('signOut');
    vu.$el('@user-menu').fadeOut(300);
    $(".logo .float-right").hide();
  });
});

//UList
//-comp: str, set element data-component
//-items: array, input for list
UListView.dom( vu => [
  { 'div': [
    { 'ul': ''}
  ]}
]);

UListView.render( vu => {
  vu.use('items').then( v =>{
    v.items.forEach( obj =>{ 
      if(obj.comp && obj.href ){
        vu.$el('ul').append(`<li class="user" data-component=${obj.comp}><a href=${obj.href}>${obj.title}</a></li>`);
      } else if(obj.comp) {
        vu.$el('ul').append(`<li class="user" data-component=${obj.comp}><a>${obj.title}</a></li>`);
      } else if(obj.href) {
        vu.$el('ul').append(`<li class="user"><a href=${obj.href}>${obj.title}</a></li>`);
      } else {
        vu.$el('ul').append(`<li class="user"><a>${obj.title}</a></li>`);
      }

      if (obj.comp) {
        let $li = vu.$el(`@${obj.comp}`)
        $li.off('click').on('click', ()=> {
          vu.res('$comp', $li);
          vu.res('comp', obj.comp);
        });
      }  
    });  
  });
})

// BoxView
// @box
// -css: object, @box's style
BoxView.dom( vu => [
  { 'div.view-box@box': ''}
]);

BoxView.render( vu => {
  vu.use('css').then( v => {
    vu.$el('@box').css(v.css);
  });
  vu.use('text').then( v=> {
    vu.$el().html(v.text.join(' '));
  });
});


// Tiles
// - w: string, total width
// - h: string, total height
// - cut: obj, cut sequences
// - colored: boolean, true to color automatically
TilesView.dom( vu => [
  { 'div': ''}
]);

TilesView.render( vu => {
  let w = vu.get('w'),
      h = vu.get('h'),
      colored = vu.get('colored') || false,
      cutObj = vu.get('cut');

  vu.set('r', BoxView.build({
    sel: vu.sel(),
    data: {
      css: { 
        width: w,
        height: h,
        display: 'inline-block',
        padding: '0',
        margin: '0',
        border: '0',
        'background-color': 'transparent'//'#' + Math.floor(Math.random() * 1000)
      }
    }
  }));
  
  let cmds = Object.keys(cutObj).sort((a, b) => {
    if (b == 'r' 
      || (a.length > b.length)) {
      return 1; 
    } 
    return -1;
  });

  cmds.map(pid => { // pid: cmd
    let cmd = cutObj[pid]; // 'x20 y30' 
    let cs = cmd.split(' '); // ['x20', 'y30']
    let xcuts = [];
    let ycuts = [];

    cs.forEach((_c,i) =>{
      // 'x20'
      //console.log('QQQQQ',_c);
      if (_c.charAt(0) == 'x') {
        xcuts.push(parseInt(_c.slice(1)));  
      }
      else{
        ycuts.push(parseInt(_c.slice(1)));
      }
    });

    function cutsArraySort(a,b){
      return a - b
    }

    xcuts = xcuts.sort(cutsArraySort);
    ycuts = ycuts.sort(cutsArraySort);

    xcuts = [0].concat(xcuts, [100]);
    ycuts = [0].concat(ycuts, [100]);
    // console.log('1111111',xcuts);
    // console.log('2222222',ycuts);

    //console.log('11111111',cs)
    let xs = cmd.match(/x/g) || [];
    let ys = cmd.match(/y/g) || [];
    let total = (xs.length + 1) * (ys.length + 1);
    let css = [];
    for (let i = 0; i < total; i++) {
      let eachCSS = {
        display: 'block',
        position: 'relative',
        float: 'left',
        width: '100%', 
        height: '100%',
        padding: '0',
        margin: '0',
        border: '0',
        overflow: 'scroll',
        'box-sizing': 'border-box'
      };
      if (colored) {
        eachCSS['background-color'] = '#' + Math.floor(Math.random() * 1000);
      }
      css.push(eachCSS);
    }

    css = css.map((s, i) => {

      // Modify s
      s.width = xcuts[i % (xcuts.length-1) + 1] - xcuts[i % (xcuts.length-1)];
      s.height = ycuts[Math.floor(i / (xcuts.length - 1)) + 1] - ycuts[(Math.floor(i / (xcuts.length - 1)))];

      s.width = s.width + '%';
      s.height = s.height + '%';

      let myId = i + '';
      if (pid != 'r') {
        myId = pid + myId;
      }
      
      vu.set(myId, BoxView.build({
        sel: vu.get(pid).sel(),
        method: 'append',
        data: {
          css: s
        }
      }));
      return s;
    }); // end of css.map
  }); // end of cmds.map

  return;

  css0[dir[x]] = L + '%'
  css1[dir[x]] = (100 - L) + '%' 


  vu.set(parentBoxId, BoxView.build({
    sel: vu.get(parentBoxId).sel(),
    method: 'append',
    data: {
      css: css0
    }
  }));


  vu.set(parentBoxId, BoxView.build({
    sel: vu.get(parentBoxId).sel(),
    method: 'append',
    data: {
      css: css1
    }
  }));
});


// Textarea
// @textarea
TextareaView.dom( vu => [
  { 'textarea(rows="1").view-textarea': ''}
]);

TextareaView.render( vu => {
  let height, 
      $this = vu.$el('textarea'),
      value = vu.get('value'),
      content;

  // Replace html entities:
  // "<" -> "&lt;"
  // ">" -> "&gt;"
  // " " -> "&nbsp;"
  // "\n" -> "<br>"

  let autosize = function(e) {

    console.log('resize', this.scrollHeight);

    // Update the value
    let updatedValue = this.value.trim();
      //.replace(/<div[^\>]*>|<br>/g, '\n')
      //.replace(/<[^<>]+>/g, '')
      //.replace(/\&nbsp\;/g, ' ')
      //.replace(/&gt;/g,'>')
      //.replace(/&lt;/g,'<')
      //.trim() || '';
    
    vu.set('value', updatedValue);
    vu.res('value', updatedValue);

    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
  };
  
  // Insert the value
  $this.val(value);

  $this.each(function () {
    let lineH = 28,
        initH = lineH + 6;

    // Calculate initial scroll height via the value
    if (value && value.length) {
      initH += lineH * (value.match(/\n/g) || []).length;
    }
    this.style.height = 'auto';
    this.setAttribute('style', 'height:' + (this.scrollHeight || initH) + 'px;overflow:hidden;');
  })
  .off('keyup')
  .off('focus')
  .on('focus', autosize)
  .on('keyup', autosize);

  setTimeout(function() {
    $this.click();
  }, 1000);
});


// ImageUploader
// @preview
// @button 
// @files: a file input
// - files: array, an array of image files
// - multi: boolean
ImageUploaderView.dom( vu => [
  { 'div.view-image-uploader.uploader': [
    { 'div@preview.preview': '' },
    { 'div.control': [
      { 'div.btn-upload@button': 'Upload'}]
    },
    //{ 'div.glyphicon.glyphicon-upload.upload-icon': '' },
    [ 'input@files.hidden(type="file" name="img[]" ' 
       + (vu.get('multi') ? 'multiple' : '')
       + ')', '']
  ]}
]);

ImageUploaderView.render( vu => {
	let $files = vu.$el('@files');
			$preview = vu.$el('@preview'),
			$button = vu.$el('@button'),
			$done = vu.$el('@done'),
			files = [],
      srcs = [];
	$button.off('click').on('click', () => {
    $files.click();
	});

	$files.off('change').on('change', e => {
		if ($files[0].files && $files[0].files[0]){
			for (let i = 0; i<e.target.files.length; i++) {
				let reader = new FileReader();
				reader.readAsDataURL($files[0].files[i]);
        files.push($files[0].files[i]);

        // Update files array
        vu.set('files', files);

				reader.onload = e => {
					srcs.push(e.target.result);
					//vu.$el(`@img-${i}`).append(`<img src="$e.target.result}" class="img-responsive">`);
					GridView.build({
						sel: vu.sel(`@preview`)   
					}).val({
						src: srcs//e.target.result
					});
          vu.set('files',files);
				};
				//$preview.append(`<div data-component="img-${i}"></div>`)
			}
		} // end of if
	});// end of change-event
});


// FormView
// FormView.dom(vu =>`
//   <div ${vu.ID}>
//     <div class="view-form">
//       <ul data-component="inputs"></ul>
//     </div>
//   </div>
// `);
FormView.dom( vu => [
  { 'div.view-form': [
    { 'ul@inputs': ''}
  ]}
]);

FormView.render(vu => {
  if (!vu.get('values')) {
    vu.set('values', []);
  }

  vu.use('inputs').then(v => {
    let vals = [];

    // Clean up @inputs
    vu.$el('@inputs').html('');

    v.inputs.forEach((obj, index) =>{
      let type = obj.type || 'text', 
          label = obj.label|| '', 
          placeholder = obj.placeholder || '',
          comp = obj.comp || `li-${index}`; 
          val = obj.value || '';
      vu.$el('@inputs').append(`
        <li>
          <div>${label}</div>
          <input type=${type} placeholder="${placeholder}" data-component="${comp}">
        </li>`
      );// end of append
      vu.$el(`@${comp}`)[0].value = val;
      vals[index] = val;
      vu.set('values', vals);
      vu.$el(`@${comp}`).off('keyup').on('keyup',e =>{
          let value = vu.$el('@' + comp)[0].value;
          vals[index] = value;
          vu.set('values', vals);
      });// end of keyup
    });// end of forEach
  });// end of vu.use
});


// PhotoView
// @img: for photo src
// @caption: for photo caption
// -link: string, the url for the photo
// -src: string, the photo url
// -caption: string, a caption for the photo
// -css: object, css for decoration the outer div
// -css['@img']: object, css for decoration the img
// -css['@caption']: object, css for decoration the caption
PhotoView.dom( vu => [
  { 'div': [
    { 'a(href="#")': [
      { 'img@img.img-responsive(src="")': ''}
    ]},
    { 'div@caption': [
      { 'a.text(href="")': ''}
    ]}
  ]}
]);

PhotoView.render(vu => {

  vu.use('link').then(v => {
    vu.$el('a').prop('href', v.link);
  })

  vu.use('src').then(v => {
    vu.$el('@img').prop('src', v.src);
  })

  vu.use('caption').then(v => {
    vu.$el('@caption').html(v.caption);
  })

  let PhotoPostCSS = vu.val('css') || {
    width: '450px',
    'text-align': 'center',
    margin: '0 auto'
  };

  vu.$el().css(PhotoPostCSS);

  let imgCSS = (vu.val('@img') && vu.val('@img').css) || {
    margin: '0 auto'
  };

  vu.$el('@img').css(imgCSS);

  let captionCSS = (vu.val('@caption') && vu.val('@caption').css) || {
    width: '100%',
    height: 'auto',
    'background-color': '#DDD',
    'font-family': '微軟正黑體'
  };

  vu.$el('@caption').css(captionCSS);
});


// GridView
// @grid: a div contain grid
// -data: array of object, an array of object with attribute 'src', 'caption','link' such as {
//   src: 'https://fakeimg.pl/440x320/282828/eae0d0/?text=World1',
//   caption: 'This is a placeholder',
//   link: 'https://www.google.com.tw/?q=1'
// }
// -src: array, contain url as value, loading [src] if no [data] import
// -css: object, decoration for the grid
// GridView.dom(vu =>
//   `<div class='view-grid' ${vu.ID}>
//       <div class='row clear-margin' data-component="grid"></div>
//     </div>
//   </div>`
// );
GridView.dom( vu => [
  { 'div.view-grid': [
    { 'div.row.clear-margin@grid': ''}
  ]}
]);

GridView.render(vu => {

  vu.use('data').then(v => {
    if (Array.isArray(v.data)) {
      v.data.forEach((item, index) => {
        vu.$el('@grid').append('<div class="col-xs-6 col-sm-4 col-md-3 col-lg-2" style="padding: 5px" data-component="img' + index + '"></div>');
        PhotoView.build({
          sel: vu.sel('@img' + index),
          method: 'append',
          data: item
        }).val({
          css: {
            'max-width': 'auto',
            width: 'auto'
          }
        })
      })
    }
  });

  if (!vu.val('data')) {
    vu.use('src').then(v => {
      for (let i = 0; i < v.src.length; i++) {
        vu.$el('@grid').append('<div class="col-xs-6 col-sm-4 col-md-3 col-lg-2" style="padding: 5px" data-component="img' + i + '"></div>');
        PhotoView.build({
          sel: vu.sel('@img' + i),
          method: 'append'
        }).val({
          src: v.src[i],
          css: {
            'max-width': 'auto',
            width: 'auto',
          }
        })
      }
    })
  }
  vu.use('css').then(v => {
    vu.$el().css(v.css);
  })
});

// Slide
// @slideItem: div to show slide image
// @slideCaption: li to show slide caption
// @slideNav: li to show slide nav
// -data: array of object, with attribute 'src', 'caption','link' such as {
//   src: 'https://fakeimg.pl/440x320/282828/eae0d0/?text=World1',
//   caption: 'This is a placeholder',
//   link: 'https://www.google.com.tw/?q=1'
// }
// -container: object, set attribute for width and heigh with default value: 980*390
// -autoSlide: boolean, set auto change slide with default value: true
// -changeTime: numnber, set the time for slide auto-changing
// -showArrow: boolean, set whether showing arrow or not with default value: true
// -mode: string, set slide mode 'slide' or 'center' with default value: slide
SlideView.dom( vu => [
  { 'div.view-slide': [
    { 'div.slide': [
      { 'i.slideButton.slideButtonLeft.glyphicon.glyphicon-chevron-left': ''},
      { 'i.slideButton.slideButtonRight.glyphicon.glyphicon-chevron-right': ''},
      { 'div.banner@slideItem': ''},
      { 'div.caption': [
        { 'ul@slideCaption': ''}
      ]},
      { 'div.slideNav': [
        { 'ul@slideNav': ''}
      ]}
    ]}
  ]}
]);

SlideView.render( vu => {

  // Default CSS Setting
  let containerCSS = {
    width: '680px',
    height: '390px'
  };

  vu.use('container').then( v => {
    containerCSS.width = v.container.width;
    containerCSS.height = v.container.height;
  })
  
  vu.$el('.view-slide').css(containerCSS);

  //  Loading Data
  vu.use('data').then( v => {
    if(Array.isArray(v.data)){
      let currentNumber = 0;
      let totalSlideNumber = v.data.length - 1;
      //  如果圖片只有一張，隱藏左右箭頭
      if(totalSlideNumber == 0){
        vu.$el('.slideButton').remove();
      }

      //  Default DOM setting
      v.data.forEach((item, index) => {
        let alink = '';
        if (item.link) {
          alink = 'href="' + item.link + '" target="_blank"';
        }
        vu.$el('@slideItem').append('<a '+ alink +'><div class="slideItem item' + index +'"></div></a>');
        vu.$el('@slideCaption').append('<li>'+ item.caption +'</li>');
        vu.$el('@slideNav').append('<li data-navitem="'+index+'"><div class="slideNavItem"></div></li>');
      })
        
      vu.$el('@slideNav').find('li').first().addClass('active');

      let slideWidth = vu.$el(".view-slide").width();
      let slideHeight = vu.$el(".view-slide").height();

      //  setting CSS to adjust slide
      vu.$el('.banner').css({
        'width': slideWidth*(totalSlideNumber+1),
        'height': slideHeight
      });
      vu.$el('.slideItem').css({
        'width': slideWidth,
        'height': slideHeight
      });
      vu.$el('.caption').css('width', slideWidth);
      vu.$el('.caption').find('ul').css('width', slideWidth*(totalSlideNumber+1));
      vu.$el('.caption').find('li').css('width', slideWidth);

      v.data.forEach((item, index) => {
        if (item.src) {
          vu.$el('.item'+ index).css('background-image', 'url('+item.src+')');
        }
      })

      //  SlideFunction
      let checkSlideNumber = (slideNumber, totalSlide) => {
        if (slideNumber < 0) {
            return totalSlide;
        } else if (slideNumber > totalSlide) {
            return 0;
        } else {
            return slideNumber;
        }
      };

      let changeSlide = () => {
        currentNumber = checkSlideNumber(currentNumber, totalSlideNumber);
        vu.$el('.banner').animate({
            'left': -slideWidth * currentNumber
        }, 400);
        vu.$el('.caption ul').animate({
            'left': -slideWidth * currentNumber
        }, 400);
        vu.$el('.slideNav li').removeClass('active');
        vu.$el('.slideNav li:eq(' + currentNumber + ')').addClass('active');
      }

      //  slideArrowButton
      vu.$el('.slideButtonRight').on('click', () => {
        currentNumber++;
        changeSlide();
      });
      vu.$el('.slideButtonLeft').on('click', () => {
        currentNumber--;
        changeSlide();
       });

      //  slideNavButton
      vu.$el('.slideNav').find('li').on('click', function(){
        currentNumber = $(this).data('navitem');
        changeSlide();
      });

      //  SetInterval
      let changeTime = vu.val('changeTime') || 3000;
      if(!(vu.val('autoSlide') === false)){
        let auto = () => {
          currentNumber++;
          changeSlide();
        }
        let clock = setInterval(auto, changeTime);

        //  Stop while hovering
        vu.$el('.banner, .slideButton').hover(() => clearInterval(clock), () => clock = setInterval(auto, changeTime));
      }

      //  Set Slide Show Mode
      let slideShowMode = vu.val('mode');
      let modeSlide = () => {vu.$el('.caption').addClass('mode-slide')};
      let modeCenter = () => {vu.$el('.caption').addClass('mode-center')};
      switch (slideShowMode){
        case 'slide':
          modeSlide();
          break;

        case 'center':
          modeCenter();
          break;

        default:
          modeSlide();
      }
    }
  })

  vu.use('showArrow').then( v => {
    if(v.showArrow === false) vu.$el('.slideButton').remove();
  })

  //  setting customer caption font
  vu.use('captionFontCSS').then( v => {
    delete v.captionFontCSS.width;
    vu.$el('.caption').find('li').css(v.captionFontCSS);
  })
})

// Select
// @select
// @options-[i]
// -options: array, an array of option object
//   -value: number or string
//   -payload: string, the content of the option
// "value" <- string, number or boolean, the value of the selected option 
SelectView.dom( vu => [
  { 'div.view-select': [
    { 'select@select' : ''}
  ]}
]);

SelectView.render( vu => {
  vu.use('options').then(v => {
    if(Array.isArray(v.options)){
      v.options.forEach((o, i) =>{
        vu.$el('@select').append(`<option data-component="option-${i}" value="${o.value}">${o.payload}</option>`);
      })

              // Add click listener
      vu.$el(`@select`).off('change').on('change', function() {
        let o = {};
        o.value = vu.$el(`@select`).val();
        o.payload = vu.$el(`@select`).find(`option:selected`).text();        

        vu.res('value', o);
      })
    } 
  })  
});

// Contact
// @title: h3
// @list: ul
// - title: string
// - items: array of strings
ContactsView.dom(vu => [
  { 'h3@title': '' },
  { 'ul@list': '' }
]);

ContactsView.render(vu => {
  vu.use('title').then(v => {
    vu.$el('@title').text(v.title);
  });

  vu.use('items').then(v => {
    if (!Array.isArray(v.items)) {
      return;
    }
    let items = v.items.map(item => {
      return '<li>' + item.value + '</li>';
    }).join('');
    vu.$el('@list').html(items);
  });
});

// Purely.Layout.Single
PurelyLayoutSingleView.dom( vu => [
  { 'div.view-purely-layout-single': [
    { 'h5@title.title': ''},
    { 'p@content.content': ''},
    { 'div@col.col': '' }
  ]}
]);  

PurelyLayoutSingleView.render( vu => {
  vu.$el().children().html('');

  let vals = vu.val();

  // vals.basic
  vu.use('basic').then(v => {
    Object.keys(v.basic).map(key =>{
      switch (key) {
        case 'title':
          vu.$el('@title').text(v.basic.title);
          break;
        case 'content':
          vu.$el('@content').html(v.basic.content.replace(/\n/g, '<br>'));
          break;
        case 'imgsrc':
          vu.$el().addClass('bg-img')
          .css({'background-image': `url(${v.basic.imgsrc})`});
          break;
        default: 
      }
    });
  });

  // vals.collection
  vu.use('collection').then(v => {
    if (v.type != 'collection') return;

    SlideView.build({
      sel:vu.sel('@col'),
      data: {
        data: v.collection.data,
        container: {
          width: '100%',
          height: '100%'
        }
      }
    });
  });

  // vals.contacts
  vu.use('contacts').then(v => {
    if (v.type != 'contacts') return;
    
    let title = v.basic.title || '';

    ContactsView.build({
      sel: vu.sel('@col'),
      data: {
        title: title,
        items: v.contacts
      }
    })
   });
});

// ListItem
// @value: text input or textarea
// - label: string
// - value: string
// - editable: boolean
// - textarea: boolean, true to use textarea instead
// "value" <- string: triggered on every keyup
// "done": <- string: only triggered on Enter or focusout event
ListItemView.dom(vu => [
  { 'div.view-list-item': [ 
    { 'div@label.item-label': '' },
    { 'div@display.item-display': '' },
    { 'div@value-wrap.hidden.color-orange': [
      { 'input@value(type="text").item-input': '' }] 
    }]
  }
]);

ListItemView.render(vu => {
  let $textInput = vu.$el('input');
  
  // Use textarea instead
  if (vu.get('textarea')) {
    TextareaView.build({
      sel: vu.sel('@value-wrap'),
      data: {
        value: vu.val('value')
      }
    });
    
    $textInput = vu.$el('textarea');

    // Just for Textarea
    $textInput.off('keyup').on('keyup', e => {
      let newVal = vu.$el('textarea').val().trim();
      if (!newVal) newVal = '';
      vu.set('value', newVal);
      vu.res('value', newVal);
    }).off('focusout').on('focusout', e => {
      vu.val('edit', false);
      vu.res('done', vu.get('value'));
    });
  }

  vu.use('label').then(v => {
    vu.$el('@label').text(v.label);
  });

  vu.use('value').then(v => {
    vu.$el('@display').html(v.value.replace(/\n/g, '<br>'));
    $textInput.val(v.value);
  });

  vu.use('placeholder').then(v => {
    $textInput.prop('placeholder', v.placeholder);
  });

  if (vu.val('edit')) {
    vu.$el('@display').addClass('hidden');
    vu.$el('@value-wrap').removeClass('hidden');
    $textInput.focus();
  } else {
    vu.$el('@display').removeClass('hidden');
    vu.$el('@value-wrap').addClass('hidden');
  }

  // Just for input[type = text]
  vu.$el('input').off('keyup').on('keyup', e => {
    let newVal = vu.$el('input').val().trim();
    if (!newVal) newVal = '';
    vu.$el('@display').html(newVal);
    if (e.which == 13) {
      vu.val('edit', false);
      vu.res('done', newVal);
    } else {
      vu.set('value', newVal);
      vu.res('value', newVal);
    }

  }).off('focusout').on('focusout', e => {
    vu.val('edit', false);
    vu.res('done', vu.get('value'));
  });

  if (vu.get('editable')) {
    ['@display', '@label'].map(comp => {
      vu.$el(comp).addClass('cope-btn')
        .off('click').on('click', e => {
          vu.val('edit', true);
        });
    }); // end of map
  }
}); 

// Purely.Page
PurelyPageClass.dom(vu => [{ 'div.view-purely-page': '' }]);
PurelyPageClass.render(vu => {
  let sectionsData = [], // to store sections data
      sampleSectionsData = [], // default sample sections
      sampleText = ''; // default sample text to fill up with

  // Set sample sections data
  sampleSectionsData = [{
    type: 'collection', 
    basic: {
      layout: 'hide', // Hide will hide every thing in basic
      title: 'Featuring'
    },
    collection: {
      layout: 'cover-slide', // col: <colID>, sort: 'recent' || 'featured'
      data: [
        { title: 'Build your dream simply', imgsrc: '/images/sample1.jpg' },
        { title: 'And share it purely', imgsrc: '/images/sample2.jpg' }
      ]
    }
  }, {
    type: 'basic',
    basic: {
      layout: 'bold-left', // default
      title: 'Story',
      content: SAMPLE_TEXT
    }
  }, {
    type: 'contacts',
    basic: { // basic layout would be 'bold-left'
      title: 'Contacts'
    },
    contacts: {
      layout: 'simple',
      data: [
        { type: 'email', value: 'My Email' },
        { type: 'phone', value: 'My Phone Number' }
      ]
    }
  }];

  // Build and render dom based on sections
  sectionsData = vu.get('sections') || sampleSectionsData;
  vu.set('sections', sectionsData.map((secData, i) => {
    //vu.$el().append('<div data-component="sec-' + i + '"></div>');
    vu().append([['div.sec-wrap@sec-' + i]]);

    return PurelySectionView.build({
      sel: vu.sel('@sec-' + i),
      data: secData
    }); 
  })); // end of vu.set('sections', ... map ... )
}); // end of Purely.Page

// Purely.Section
PurelySectionClass.dom(vu => [{ 'div.view-purely-section': '' }]);
PurelySectionClass.render(vu => {
  let type = vu.get('type') || 'basic',
      basicData = vu.get('basic') || {},
      collectionData = vu.get('collection') || {},
      contactsData = vu.get('contacts') || {},
      basicClass = Views.class('Purely.Section.Basic'),
      collectionClass = Views.class('Purely.Section.Collection'),
      contactsClass = Views.class('Purely.Section.Contacts'),
      basicVu,
      collectionVu,
      contactsVu,
      compLayout;

  compLayout = collectionData && collectionData.layout 
    || contactsData && contactsData.layout;

  if (compLayout) {
    basicData.compLayout = compLayout;
  }

  basicVu = basicClass.build({
    sel: vu.sel(),
    data: basicData
  });

  switch (type) {
    case 'collection':
      collectionVu = collectionClass.build({
        sel: basicVu.sel('@comp'),
        data: collectionData
      });
      break;
    case 'contacts':
      contactsVu = contactsClass.build({
        sel: basicVu.sel('@comp'),
        data: contactsData
      });
      break;
    default:
  }
}); // end of Purely.Section

// Purely.Section.Basic
// @title
// @content
// @comp
// @bg-mask
PurelySectionBasicClass.dom(vu => [
  { 'section.view-purely-section-basic': [
    { 'div.text-wrap': [
      { 'h2@title': '' },
      { 'p@content': '' }]
    }, 
    { 'div@comp.comp-wrap': '' },
    { 'div@bg-mask.color-mask': '' }] 
  }
]);

PurelySectionBasicClass.render(vu => {
  let title = vu.get('title') || '',
      content = vu.get('content') || '',
      layout = vu.get('layout') || 'bold-left',
      compLayout = vu.get('compLayout') || false,
      imgsrc = vu.get('imgsrc'),
      vidsrc = vu.get('vidsrc'),
      bgColor = vu.get('bgColor'),
      colorStrength = vu.get('colorStrength');

  title = title.replace(/\n/g, ' ');
  content = content.replace(/\n/g, '<br>');
  if (vidsrc) {
    // TBD
  } 
  if (imgsrc) {
    vu.$el().css({
      'background-image': 'url(' + imgsrc + ')' 
    });
  } 
  if (bgColor) {
    vu.$el('@bg-mask').css({
      'background-color': bgColor  
    });
  } 
  if (!isNaN(colorStrength)) {
    vu.$el('@bg-mask').css({
      'opacity': colorStrength  
    });
  }

  vu('@title').html(title);
  vu('@content').html(content);
  vu.$el().addClass('layout-' + layout);
  if (compLayout) {
    vu.$el().addClass('layout-' + compLayout);
  }
}); // end of Purely.Section.Basic

// Purely.Section.Collection
PurelySectionCollectionClass.dom(vu => [
  { 'div.view-purely-section-collection': [
    { 'div@collection': '' }] 
  }
]);

PurelySectionCollectionClass.render(vu => {
  let layout = vu.get('layout'),
      data = vu.get('data'),
      itemViews = [];

  if (!Array.isArray(data)) { data = []; }
  itemViews = data.map((x, i) => {
    vu('@collection').append([[ 'div.col-item@item-' + i, '' ]]);
    
    let itemView = PurelySectionBasicClass.build({
      sel: vu.sel('@item-' + i),
      data: x
    });

    if (i > 0) { itemView.$el().hide(); }
    return itemView;
  });

  vu.set('itemViews', itemViews);

  // Slide, Grid and Waterfall animation based on layout
  if (layout.slice(-5) == 'slide' && itemViews.length > 1) {
    vu.set('turn', 0);
    setInterval(function() {
      let turn = vu.map('turn', turn => (turn + 1) % itemViews.length);
      itemViews.map(x => {
        x.$el().fadeOut(900);
      });
      itemViews[turn].$el().fadeIn(900);
    }, 2600);
  } else if (layout.slice(-4) == 'grid') {
    // TBD
  } else if (layout.slice(-9) == 'waterfall') {
    // TBD  
  }
});
// end of Purely.Section.Collection

// Purely.Section.Contacts
PurelySectionContactsClass.dom(vu => [
  { 'div.view-purely-section-contacts': [
    { 'div@contacts': '' }] 
  }
]);

PurelySectionContactsClass.render(vu => {
  let layout = vu.get('layout'),
      data = vu.get('data');

  if (!Array.isArray(data)) { data = []; }
  data.map((x, i) => {
    let value = x && x.value || '',
        label = x && x.label || '',
        type = x && x.type || '';

    if (value) {
      vu('@contacts').append([[ 'div.contacts-item@item-' + i, [
        { 'div.item-icon': '' }, // based on type
        { 'div.item-label': label },
        { 'div.item-value': value }]
      ]]);
    }
  });
});
// end of Purely.Section.Contacts


//-------------------------------------
})(jQuery, Cope);
