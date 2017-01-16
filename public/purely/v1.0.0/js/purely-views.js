const Views = Cope.useViews('Purely');

let NavView = Views.class('Nav'),
  BoxView = Views.class('Box'),
  TextareaView = Views.class('Textarea'),
  ImageUploaderView = Views.class('ImageUploader'),
  PhotoView = Views.class('Photo'),
  GridView = Views.class('Grid'),
  SlideView = Views.class('Slide'),
  SelectView = Views.class('Select'),
  UListView = Views.class('Ulist'),
  FormView = Views.class('Form');

// NavView
// @logo
// @main-items: nav
// @signIn: ul
// @user: ul
// @menu
// @nav-items: ul
// @close-button: close-icon
// @items: ul
// @user-menu
// @user-items: ul
// -signedIn: bool, check user signed
// -navItems: array, input for @item
// -user-items: array, input for @user-items
// -css: object, NavView's style
// -@logo: object
//   -logoText: string
//   -css: object
// "signIn" <- null
// "signOut" <- null
NavView.dom(vu => (`
  <header ${vu.ID} class="view-nav">
    <div data-component="logo" class="logo bg">Logo</div>
    <div class="float-right">
      <nav data-component="main-items">
        <ul data-component="signIn" class="hidden-xs hidden">
          <li><a class="user">Sign in</a></li>
        </ul>
        <ul data-component="user" class="hidden-xs hidden">
          <li><a class="user">User Name</a></li>
        </ul>
        <ul class="hidden">
          <li data-component="menu-button" class="menu-icon glyphicon glyphicon-menu-hamburger"></li>
        </ul>
      </nav>
    </div>
    <div class="view-nav-items bg-w" data-component="menu" >
      <div class="glyphicon glyphicon-remove float-right remove-icon" data-component="close-button"></div>
      <nav style="text-align: center;">
        <ul data-component="nav-items" >
        </ul>
      </nav>
    </div>
    <div style="z-index: 2;" class="view-nav-items  bg-w" data-component="user-menu">
      <div class="glyphicon glyphicon-remove float-right remove-icon" data-component="close-button"></div>
    	<nav style="text-align: center;">
				<ul data-component="user-items"></ul>
    	</nav>
    </div>
  </header>`));

NavView.render(vu => {
  // Just with logoText
  vu.use('@logo.logoText').then(v => {
    vu.$el('@logo').html(v['@logo'].logoText);
  });
  //userItems, signedIn, member 
  vu.use('signedIn, user-items').then(v => {
    console.log(v.member);
    vu.$el('@signIn').removeClass('hidden');
    vu.$el('@user').removeClass('hidden');
  	if (v.signedIn) {
      vu.$el('@signIn').hide();
      vu.$el('@user').show();
    } else {
      vu.$el('@signIn').show();
      vu.$el('@user').hide();
    }
    vu.$el('@user-items').html('');
    v["user-items"].forEach(obj => {
    	if(obj.href){
    		vu.$el("@user-items").append(`<li class="user"><a href=${obj.href}>${obj.title}</a></li>`)
    	} else {
    		vu.$el("@user-items").append(`<li class="user"><a data-component=${obj.comp}>${obj.title}</a></li>`)
    	}
    });
  });
  //mainItems
  vu.use('mainItems').then(v=> {
    //vu.$el('@main-items').append(`<ul data-component="user-defined-items"><ul>`);
    UListView.build({
      sel: vu.sel('@main-items'),
      data: {
        comp: "user-defined-items",
        items: v.mainItems
      }
    }).res('comp', comp => {
      console.log(comp);
    });
  });  

  //navItems
  vu.use('navItems').then(v => {
    vu.$el('@menu-button').parent().removeClass('hidden');
  	vu.$el('@nav-items').html('');
    v.navItems.forEach(obj => {
      vu.$el('@nav-items').append(`<li class="user"><a href=${obj.href}>${obj.title}</a></li>`);
    });
  });
  //css
  vu.use('css').then(v=> {
    vu.$el().css(v.css);
    if (v.css.height) {
      vu.$el().css('line-height', v.css.height);
    }
  });
  //@logo
  vu.use('@logo.css').then(v => {
    vu.$el('@logo').css(v['@logo'].css);
    vu.$el('@logo').html(v['@logo'].logoText);
  });

  //animate include @menu && @user-menu
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
UListView.dom(vu => (`
  <div ${vu.ID}>
    <ul></ul>
  </div>
`));
UListView.render(vu => {
  vu.use('items').then(v =>{
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
BoxView.dom( vu => (`
	<div ${vu.ID} data-component="box" class="box">
	</div>
`));

BoxView.render(vu => {
  vu.use('css').then(v => {
    vu.$el('@box').css(v.css);
  });
  vu.use('text').then(v=> {
    vu.$el().html(v.text.join(' '));
  });
});

// Textarea
// @textarea
TextareaView.dom( vu => {
	return `<textarea rows="1" ${vu.ID} class="view-textarea">
    </textarea>`;
});

TextareaView.render(vu => {
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
    console.log('value', value);
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
// done <- files: array, an array of files 
ImageUploaderView.dom( vu => (`
	<div ${vu.ID} class="view-image-uploader">
		<div data-component="preview"></div>
		<button data-component="button">上傳</button>
		<button data-component="done" style="float: right">完成</button>
		<input data-component="files" type="file" name="img[]" multiple class="hidden" >
	</div>
`));

ImageUploaderView.render( vu => {
	let $files = vu.$el('@files');
			$preview = vu.$el('@preview'),
			$button = vu.$el('@button'),
			$done = vu.$el('@done'),
			files = [];
	$button.off('click').on('click', () => {
    $files.click();
	});

	$done.off('click').on('click', e => {
		vu.res('done', files);	
	});
	$files.off('change').on('change', e => {
		if ($files[0].files && $files[0].files[0]){
			for (let i = 0; i<e.target.files.length; i++) {
				let reader = new FileReader();
				reader.readAsDataURL($files[0].files[i]);
				reader.onload = e => {
					console.log(files);
					files.push(e.target.result);
					//vu.$el(`@img-${i}`).append(`<img src="${e.target.result}" class="img-responsive">`);
					GridView.build({
						sel: vu.sel(`@preview`)   
					}).val({
						src: files//e.target.result
					});
				};
			
				//$preview.append(`<div data-component="img-${i}"></div>`)
			}
		} // end of if
	});// end of change-event
});

// FormView
FormView.dom(vu =>`
  <div ${vu.ID}>
    <div class="view-form">
      <ul data-component="inputs"></ul>
    </div>
  </div>
`);

FormView.render(vu => {
  vu.use('inputs').then(v => {
    let vals = [];
    v.inputs.forEach((obj, index) =>{
      let type = obj.type || 'text', 
          label = obj.label|| '', 
          placeholder = obj.placeholder || '',
          comp = obj.comp || ''; 
      vu.$el('@inputs').append(`<li>
                                  <div>${label}</div>
                                  <input type=${type} placeholder="${placeholder}" data-component=${comp}>
                                </li>`
      );// end of append
      vu.$el(`@${comp}`).off('input').on('input',e =>{
          let value = vu.$el(`@${comp}`)[0].value;
          console.log(value);
          vals[index] = value;
          vu.set('values', vals);
          console.log(vals);
      });
    });// end of forEach
  });// end of vu.use
});




// PhotoView
// @img: for image src
// @caption: for image caption
// -link: an url for href
// -src: an image url
// -caption: a caption for the photo
// -css: an object for decoration the outer div
// -css['@img']: an object for decoration the img
// -css['@caption']: an object for decoration the caption
PhotoView.dom(vu =>
  `<div ${vu.ID}>
    <a href="#">
      <img data-component="img" class="img-responsive" src="">
    </a>
    <div data-component="caption">
      <a href="#" class="text">
      </a>
    </div>
  </div>`
);

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
// -data: an array of object with attribute 'src', 'caption','link' such as {
//   src: 'https://fakeimg.pl/440x320/282828/eae0d0/?text=World1',
//   caption: 'This is a placeholder',
//   link: 'https://www.google.com.tw/?q=1'
// }
// -src: an array with url as value, loading this if no data import
// -css: an object
GridView.dom(vu =>
  `<div class='view-grid' ${vu.ID}>
      <div class='row clear-margin' data-component="grid"></div>
    </div>
  </div>`
);

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
// @slideItem
// @slideCaption
// @slideNav
SlideView.dom(vu =>
  `<div class="view-slide" ${vu.ID}>
    <div class="slide">
      <i class="slideButton slideButtonLeft glyphicon glyphicon-chevron-left"></i>
      <i class="slideButton slideButtonRight glyphicon glyphicon-chevron-right"></i>
      <div class="banner" data-component="slideItem">
      </div>
      <div class="caption">
        <ul data-component="slideCaption">
        </ul>
      </div>
      <div class="slideNav">
        <ul data-component="slideNav">          
        </ul>
      </div>
    </div>
  </div>`
);
SlideView.render(vu => {

  let slideWidth = parseInt($(".view-slide").css('width'));
  let slideHeight = parseInt($("view-slide").css('height'));

  //  setting CSS to adjust slide
  vu.use('data').then(v => {


    if(Array.isArray(v.data)){
      let currentNumber = 0;
      let totalSlideNumber = v.data.length - 1;

      //  DOM setting
      v.data.forEach((item, index) => {
        vu.$el('@slideItem').append('<a href='+ item.link +'><div class="slideItem item' + index +'"></a>');
        vu.$el('@slideCaption').append('<li>'+ item.caption +'<li>');
        vu.$el('@slideNav').append('<li><i class="glyphicon glyphicon-stop"></i></li>');
      })

      //  CSS Setting
      $('.view-slide').css({
        'width': v.container.width,
        'height': v.container.height
      });
      $('.banner').css({
        'width': slideWidth*(totalSlideNumber+1),
        'height': slideHeight
      });
      $('.slideItem').css({
        'width': slideWidth,
        'height': slideHeight
      });
      $('.caption').css('width', slideWidth);
      $('.caption').find('ul').css('width', slideWidth*3);
      $('.caption').find('li').css('width', slideWidth);
      v.data.forEach((item, index) => {
        $('.item'+ index).css('background-image', item.src);
      })


      let checkSlideNumber = (slideNumber, totalSlide) => {
        if (slideNumber < 0) {
            return totalSlide;
        } else if (slideNumber > totalSlide) {
            return 0;
        } else {
            return slideNumber;
        }
      };

      $('.slideButtonRight').on('click', function() {
        currentNumber++;
        currentNumber = checkSlideNumber(currentNumber, totalSlideNumber);
        $('.banner').animate({
            'left': -slideWidth * currentNumber
        }, 400);
        $('.caption ul').animate({
            'left': -slideWidth * currentNumber
        }, 400);
        $('.slideNav li').removeClass('active');
        $('.slideNav li:eq(' + currentNumber + ')').addClass('active');
      });

      $('.slideButtonLeft').on('click', function() {
        currentNumber--;
        currentNumber = checkSlideNumber(currentNumber, totalSlideNumber);
        $('.banner').animate({
            'left': -slideWidth * currentNumber
        }, 400);

        $('.caption ul').animate({
            'left': -slideWidth * currentNumber
        }, 400);

        $('.slideNav li').removeClass('active');
        $('.slideNav li:eq(' + currentNumber + ')').addClass('active');
       });
    }
  })
})


// Select
// @select
// @options-[i]
// -options: array, an array of option object
//   -value: number or string
//   -payload: string, the content of the option
// "value" <- string, number or boolean, the value of the selected option 
SelectView.dom(vu => 
  `<div ${vu.ID} class="view-select">
    <select data-component="select">
    </select>
  </div>`
);

SelectView.render(vu => {
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
